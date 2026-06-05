/** @format */

import { useCallback, useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, Platform } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
import { checkForNotificationsPermission, openNotificationsSettings } from '@/specs';
import { settingsStore } from '@/store';
import { PERMISSIONS_CHANGED_EVENT } from '@/utils/permissions/notificationPermissionEvents';
import { requestPostNotificationsPermission } from '@/utils/permissions/requestNotificationPermission';

const readSystemNotificationsGranted = (): boolean =>
  Platform.OS !== 'android' ? true : checkForNotificationsPermission();

export const useNotificationsSetting = () => {
  const notificationsEnabled = settingsStore((state) => state.notificationsEnabled);
  const setNotificationsEnabled = settingsStore((state) => state.setNotificationsEnabled);
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
    const subscription = DeviceEventEmitter.addListener(PERMISSIONS_CHANGED_EVENT, reconcileRevokedPermission);

    return () => subscription.remove();
  }, [reconcileRevokedPermission]);

  useAppStateOnActive(reconcileRevokedPermission);

  useFocusEffect(
    useCallback(() => {
      reconcileRevokedPermission();
    }, [reconcileRevokedPermission]),
  );

  const isEnabled = notificationsEnabled && (Platform.OS !== 'android' || systemGranted);

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
