/** @format */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';

import { getAppDisplayName } from '@/constants/appDisplayName';
import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
import { configurePermissionStatusSyncAnimation } from '@/utils/layoutAnimation';
import { PERMISSIONS_CHANGED_EVENT } from '@/utils/permissions/notificationPermissionEvents';
import { scheduleAfterInteractions } from '@/utils/scheduleAfterInteractions';

import { createPermissions, PERMISSION_IDS } from '../data/permissions';
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
): boolean => PERMISSION_IDS.some((id) => previous[id] !== next[id]);

export const usePermissionsSync = () => {
  const permissionItems = useMemo(() => createPermissions(getAppDisplayName()), []);
  const [statusById, setStatusById] = useState<Record<PermissionId, PermissionStatus>>(
    () => Object.fromEntries(PERMISSION_IDS.map((id) => [id, 'pending'])) as Record<PermissionId, PermissionStatus>,
  );

  const syncStatuses = useCallback(() => {
    setStatusById((previous) => {
      const next = readPermissionStatuses();

      if (!hasStatusChanged(previous, next)) {
        return previous;
      }

      configurePermissionStatusSyncAnimation();
      return next;
    });
  }, []);

  useEffect(() => {
    scheduleAfterInteractions(syncStatuses);
  }, [syncStatuses]);

  useAppStateOnActive(syncStatuses);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(PERMISSIONS_CHANGED_EVENT, syncStatuses);

    return () => subscription.remove();
  }, [syncStatuses]);

  const permissions = useMemo(
    () => buildPermissionsWithStatus(permissionItems, statusById),
    [permissionItems, statusById],
  );
  const canContinue = areRequiredPermissionsGranted(statusById);

  const handleGrant = useCallback((id: PermissionId) => {
    requestPermissionById(id);
  }, []);

  return { statusById, permissions, canContinue, handleGrant, syncStatuses };
};
