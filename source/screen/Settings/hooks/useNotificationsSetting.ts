/** @format */

import { useCallback, useEffect, useRef, useState } from 'react';

import { useShallow } from 'zustand/react/shallow';

import { useRunOnFocusAndActive } from '@/hooks/useRunOnFocusAndActive';
import { openNotificationsSettings, subscribePermissionsChanged } from '@/specs';
import { settingsStore } from '@/store';
import { requestPostNotificationsPermission } from '@/utils/permissions/requestNotificationPermission';

import { isSystemNotificationGrantRequired, readSystemNotificationsGranted } from '../notificationGrant';

export const useNotificationsSetting = () => {
  const { notificationsEnabled, setNotificationsEnabled } = settingsStore(
    useShallow((state) => ({
      notificationsEnabled: state.notificationsEnabled,
      setNotificationsEnabled: state.setNotificationsEnabled,
    })),
  );
  const [systemGranted, setSystemGranted] = useState(readSystemNotificationsGranted);
  const permissionRequestInFlightRef = useRef(false);

  const refreshSystemGrant = useCallback(() => {
    setSystemGranted(readSystemNotificationsGranted());
  }, []);

  const reconcileRevokedPermission = useCallback(() => {
    const granted = readSystemNotificationsGranted();
    setSystemGranted(granted);

    if (permissionRequestInFlightRef.current) {
      return;
    }

    if (!granted && notificationsEnabled) {
      setNotificationsEnabled(false);
    }
  }, [notificationsEnabled, setNotificationsEnabled]);

  useEffect(() => {
    refreshSystemGrant();
  }, [refreshSystemGrant]);

  useEffect(() => {
    const subscription = subscribePermissionsChanged(reconcileRevokedPermission);

    return () => subscription.remove();
  }, [reconcileRevokedPermission]);

  useRunOnFocusAndActive(reconcileRevokedPermission);

  const isEnabled = notificationsEnabled && (!isSystemNotificationGrantRequired || systemGranted);

  const setEnabled = useCallback(
    async (value: boolean) => {
      if (value) {
        permissionRequestInFlightRef.current = true;
        setNotificationsEnabled(true);

        try {
          const requestGranted = await requestPostNotificationsPermission();
          const granted = requestGranted || readSystemNotificationsGranted();
          setSystemGranted(granted);

          if (!granted) {
            setNotificationsEnabled(false);
          }
        } finally {
          permissionRequestInFlightRef.current = false;
        }

        return;
      }

      permissionRequestInFlightRef.current = false;
      setNotificationsEnabled(false);
      refreshSystemGrant();
      openNotificationsSettings();
    },
    [refreshSystemGrant, setNotificationsEnabled],
  );

  return { isEnabled, setEnabled };
};
