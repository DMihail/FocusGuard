import { useCallback, useEffect, useMemo, useState } from 'react';

import { getAppDisplayName } from '@/constants/appDisplayName';
import type { PermissionId, PermissionStatus } from '@/domain/permissions';
import { areRequiredPermissionsGranted, getPermissionIds, requestPermissionById } from '@/domain/permissions';
import { getPermissionStatuses, invalidatePermissionSnapshot } from '@/domain/permissionSnapshot';
import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
import { subscribePermissionsChanged } from '@/specs';
import { scheduleAfterInteractions } from '@/utils/scheduleAfterInteractions';

import { createPermissions } from '../data/permissions';
import { buildPermissionsWithStatus } from '../utils/buildPermissionsWithStatus';

const hasStatusChanged = (
  previous: Record<PermissionId, PermissionStatus>,
  next: Record<PermissionId, PermissionStatus>,
): boolean => getPermissionIds().some((id) => previous[id] !== next[id]);

export const usePermissionsSync = () => {
  const permissionItems = useMemo(() => createPermissions(getAppDisplayName()), []);
  const [statusById, setStatusById] = useState<Record<PermissionId, PermissionStatus>>(() => getPermissionStatuses());

  const syncStatuses = useCallback((force = false) => {
    if (force) {
      invalidatePermissionSnapshot();
    }

    setStatusById((previous) => {
      const next = getPermissionStatuses(force);

      if (!hasStatusChanged(previous, next)) {
        return previous;
      }

      return next;
    });
  }, []);

  useEffect(() => {
    scheduleAfterInteractions(() => syncStatuses(true));
  }, [syncStatuses]);

  const syncOnActive = useCallback(() => {
    syncStatuses(true);
  }, [syncStatuses]);

  useAppStateOnActive(syncOnActive);

  useEffect(() => {
    const subscription = subscribePermissionsChanged(() => syncStatuses(true));

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

  return { permissions, canContinue, handleGrant, syncStatuses };
};
