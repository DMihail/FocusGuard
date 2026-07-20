/** @format */

import { useCallback, useRef, useState } from 'react';

import { useShallow } from 'zustand/react/shallow';

import { useNativePermissionsChangedRefresh } from '@/hooks/useNativePermissionsChangedRefresh';
import { openNotificationsSettings } from '@/specs';
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

  useNativePermissionsChangedRefresh(reconcileRevokedPermission);

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
      setSystemGranted(readSystemNotificationsGranted());
      openNotificationsSettings();
    },
    [setNotificationsEnabled],
  );

  return { isEnabled, setEnabled };
};
