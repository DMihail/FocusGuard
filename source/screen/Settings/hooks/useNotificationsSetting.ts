/** @format */

import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
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
  }, [syncFromSystem]);

  useAppStateOnActive(syncFromSystem);

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
