import { useCallback, useEffect, useEffectEvent, useMemo, useState } from 'react';

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

export const usePermissionsSync = () => {
  const { t } = useTranslation();
  const permissionItems = useMemo(() => createPermissions(getAppDisplayName(), t), [t]);
  const [statusById, setStatusById] = useState<Record<PermissionId, PermissionStatus>>(() => getPermissionStatuses());

  const applyStatuses = useCallback(() => {
    setStatusById((previous) => {
      const next = getPermissionStatuses(true);

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

  const onPermissionsChanged = useEffectEvent(syncStatuses);

  useFocusEffect(
    useCallback(() => {
      syncStatuses();
    }, [syncStatuses]),
  );

  useEffect(() => {
    const subscription = subscribePermissionsChanged(onPermissionsChanged);

    return () => subscription.remove();
  }, []);

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
    requestPermissionById(id);
  }, []);

  return { permissions, canContinue, handleGrant };
};
