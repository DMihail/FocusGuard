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
  // State drives the switch during the system prompt; ref lets reconcile skip mid-request.
  const [permissionRequestInFlight, setPermissionRequestInFlight] = useState(false);
  const permissionRequestInFlightRef = useRef(false);

  const setPermissionRequestInFlightBoth = (inFlight: boolean): void => {
    permissionRequestInFlightRef.current = inFlight;
    setPermissionRequestInFlight(inFlight);
  };

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

  // On Android, store can be "enabled" while systemGrant is still false during the prompt.
  // Keep the switch on for that window — useOptimistic cannot, because baseEnabled stays false
  // and a short startTransition ends before the dialog returns.
  const isEnabled =
    permissionRequestInFlight || (notificationsEnabled && (!isSystemNotificationGrantRequired || systemGranted));

  const setEnabled = useCallback(
    async (value: boolean) => {
      if (value) {
        setPermissionRequestInFlightBoth(true);
        setNotificationsEnabled(true);

        try {
          const requestGranted = await requestPostNotificationsPermission();
          const granted = requestGranted || readSystemNotificationsGranted();
          setSystemGranted(granted);

          if (!granted) {
            setNotificationsEnabled(false);
          }
        } finally {
          setPermissionRequestInFlightBoth(false);
        }

        return;
      }

      setPermissionRequestInFlightBoth(false);
      setNotificationsEnabled(false);
      setSystemGranted(readSystemNotificationsGranted());
      openNotificationsSettings();
    },
    [setNotificationsEnabled],
  );

  return { isEnabled, setEnabled };
};
