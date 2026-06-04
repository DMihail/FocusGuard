/** @format */

import { useCallback, useEffect, useState } from 'react';
import { AppState, type AppStateStatus, Platform } from 'react-native';

import { checkForNotificationsPermission, openNotificationsSettings, requestNotificationsPermission } from '@/specs';
import { settingsStore } from '@/store';

const readSystemNotificationsGranted = (): boolean =>
  Platform.OS !== 'android' ? true : checkForNotificationsPermission();

export const useNotificationsSetting = () => {
  const notificationsEnabled = settingsStore((state) => state.notificationsEnabled);
  const setNotificationsEnabled = settingsStore((state) => state.setNotificationsEnabled);
  const [systemGranted, setSystemGranted] = useState(readSystemNotificationsGranted);

  const syncFromSystem = useCallback(() => {
    const granted = readSystemNotificationsGranted();
    setSystemGranted(granted);

    if (!granted && notificationsEnabled) {
      setNotificationsEnabled(false);
    }
  }, [notificationsEnabled, setNotificationsEnabled]);

  useEffect(() => {
    syncFromSystem();

    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        syncFromSystem();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [syncFromSystem]);

  const isEnabled = notificationsEnabled && (Platform.OS !== 'android' || systemGranted);

  const setEnabled = useCallback(
    (value: boolean) => {
      if (value) {
        setNotificationsEnabled(true);
        requestNotificationsPermission();
        return;
      }

      setNotificationsEnabled(false);
      openNotificationsSettings();
    },
    [setNotificationsEnabled],
  );

  return { isEnabled, setEnabled };
};
