/** @format */

import { useCallback, useEffect, useState } from 'react';
import { AppState, type AppStateStatus, LayoutAnimation } from 'react-native';

import { PERMISSIONS } from '../data/permissions';
import type { PermissionId, PermissionStatus } from '../types';
import { readPermissionStatuses, requestPermissionById } from '../utils/permissionStatus';

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

    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        syncStatuses();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [syncStatuses]);

  const handleGrant = useCallback((id: PermissionId) => {
    requestPermissionById(id);
  }, []);

  return { statusById, handleGrant, syncStatuses };
};
