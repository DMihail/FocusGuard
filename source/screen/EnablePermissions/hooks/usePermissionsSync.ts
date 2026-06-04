/** @format */

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
import { configurePermissionStatusSyncAnimation } from '@/utils/layoutAnimation';

import { PERMISSIONS } from '../data/permissions';
import type { PermissionId, PermissionStatus } from '../types';
import { buildPermissionsWithStatus } from '../utils/buildPermissionsWithStatus';
import {
  areRequiredPermissionsGranted,
  readPermissionStatuses,
  requestPermissionById,
} from '../utils/permissionStatus';

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
        configurePermissionStatusSyncAnimation();
      }

      return next;
    });
  }, []);

  useEffect(() => {
    syncStatuses();
  }, [syncStatuses]);

  useAppStateOnActive(syncStatuses);

  const permissions = useMemo(() => buildPermissionsWithStatus(statusById), [statusById]);
  const canContinue = areRequiredPermissionsGranted(statusById);

  const handleGrant = (id: PermissionId) => {
    requestPermissionById(id);
  };

  return { statusById, permissions, canContinue, handleGrant, syncStatuses };
};
