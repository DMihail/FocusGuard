/** @format */

import { useCallback } from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { useFamilyActivityPicker } from './useFamilyActivityPicker.ios';
import { useManageApps } from './useManageApps.ios';

/** Screen-level state for Manage Apps on iOS (FamilyActivityPicker + selected apps). */
export const useManageAppsScreen = () => {
  const { refreshInstalledApps, ...manageApps } = useManageApps();
  const { pickApps, isPicking } = useFamilyActivityPicker();

  const onPickApps = useCallback(() => {
    pickApps()
      .then(() => refreshInstalledApps(true))
      .catch(() => undefined);
  }, [pickApps, refreshInstalledApps]);

  useFocusEffect(
    useCallback(() => {
      refreshInstalledApps().catch(() => undefined);
    }, [refreshInstalledApps]),
  );

  return {
    ...manageApps,
    refreshInstalledApps,
    showSearchToolbar: false,
    showInstalledAppsList: false,
    onPickApps,
    isPickingApps: isPicking,
  };
};
