/** @format */

import { useCallback } from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { useManageApps } from './useManageApps.android';

/** Screen-level state for Manage Apps on Android (catalog search + filters). */
export const useManageAppsScreen = () => {
  const { refreshInstalledApps, ...manageApps } = useManageApps();

  useFocusEffect(
    useCallback(() => {
      refreshInstalledApps().catch(() => undefined);
    }, [refreshInstalledApps]),
  );

  return {
    ...manageApps,
    refreshInstalledApps,
    showSearchToolbar: true,
    showInstalledAppsList: true,
    onPickApps: undefined,
    isPickingApps: false,
  };
};
