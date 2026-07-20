import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { getAppDisplayName } from '@/constants/appDisplayName';
import type { PermissionId, PermissionStatus } from '@/domain/permissions';
import { areRequiredPermissionsGranted, getPermissionIds, requestPermissionById } from '@/domain/permissions';
import { getPermissionStatuses, invalidatePermissionSnapshot } from '@/domain/permissionSnapshot';
import { useTranslation } from '@/i18n';
import { subscribePermissionsChanged } from '@/specs';

import { createPermissions } from '../data/permissions';

const hasStatusChanged = (
  previous: Record<PermissionId, PermissionStatus>,
  next: Record<PermissionId, PermissionStatus>,
): boolean => getPermissionIds().some((id) => previous[id] !== next[id]);

/** Keeps Usage Access granted in UI when AppOps briefly reads false after other permission screens. */
const keepUsageAccessGranted = (
  next: Record<PermissionId, PermissionStatus>,
  usageAccessWasGranted: boolean,
): Record<PermissionId, PermissionStatus> => {
  if (Platform.OS !== 'android' || !usageAccessWasGranted || next['usage-access'] === 'granted') {
    return next;
  }

  return { ...next, 'usage-access': 'granted' };
};

export const usePermissionsSync = () => {
  const { t } = useTranslation();
  const permissionItems = useMemo(() => createPermissions(getAppDisplayName(), t), [t]);
  const [statusById, setStatusById] = useState<Record<PermissionId, PermissionStatus>>(() => getPermissionStatuses());
  const usageAccessGrantedRef = useRef(statusById['usage-access'] === 'granted');

  const applyStatuses = useCallback(() => {
    setStatusById((previous) => {
      const nativeStatuses = getPermissionStatuses(true);

      if (nativeStatuses['usage-access'] === 'granted') {
        usageAccessGrantedRef.current = true;
      }

      const next = keepUsageAccessGranted(nativeStatuses, usageAccessGrantedRef.current);

      if (!hasStatusChanged(previous, next)) {
        return previous;
      }

      return next;
    });
  }, []);

  const syncStatuses = useCallback(() => {
    invalidatePermissionSnapshot();
    applyStatuses();
  }, [applyStatuses]);

  useFocusEffect(
    useCallback(() => {
      syncStatuses();
    }, [syncStatuses]),
  );

  useEffect(() => {
    const subscription = subscribePermissionsChanged(() => syncStatuses());

    return () => subscription.remove();
  }, [syncStatuses]);

  const permissions = useMemo(
    () =>
      permissionItems.map((item) => ({
        ...item,
        status: statusById[item.id] ?? item.status,
      })),
    [permissionItems, statusById],
  );
  const canContinue = areRequiredPermissionsGranted(statusById);

  const handleGrant = useCallback((id: PermissionId) => {
    if (id === 'usage-access') {
      usageAccessGrantedRef.current = false;
    }

    requestPermissionById(id);
  }, []);

  return { permissions, canContinue, handleGrant };
};
