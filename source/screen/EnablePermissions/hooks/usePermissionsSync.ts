/** @format */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutAnimation } from 'react-native';

import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';

import { PERMISSIONS } from '../data/permissions';
import type { PermissionId, PermissionStatus } from '../types';
import { buildPermissionsWithStatus } from '../utils/buildPermissionsWithStatus';
import { areAllPermissionsGranted, readPermissionStatuses, requestPermissionById } from '../utils/permissionStatus';

const configureCardLayoutAnimation = () => {
  LayoutAnimation.configureNext(LayoutAnimation.create(380, 'easeInEaseOut', 'opacity'));
};

const hasStatusChanged = (
  previous: Record<PermissionId, PermissionStatus>,
  next: Record<PermissionId, PermissionStatus>,
): boolean => PERMISSIONS.some((item) => previous[item.id] !== next[item.id]);

export const usePermissionsSync = () => {
  const [statusById, setStatusById] = useState<Record<PermissionId, PermissionStatus>>(() => readPermissionStatuses());

  const syncStatuses = useCallback(() => {
    setStatusById((previous) => {
      const next = readPermissionStatuses();

      if (hasStatusChanged(previous, next)) {
        configureCardLayoutAnimation();
      }

      return next;
    });
  }, []);

  useEffect(() => {
    syncStatuses();
  }, [syncStatuses]);

  useAppStateOnActive(syncStatuses);

  const permissions = useMemo(() => buildPermissionsWithStatus(statusById), [statusById]);
  const canContinue = areAllPermissionsGranted();

  const handleGrant = useCallback((id: PermissionId) => {
    requestPermissionById(id);
  }, []);

  return { statusById, permissions, canContinue, handleGrant, syncStatuses };
};
