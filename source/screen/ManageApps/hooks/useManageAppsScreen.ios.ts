/** @format */

import { useCallback } from 'react';

import { reportError } from '@/crashlytics/reportError';

import { useFamilyActivityPicker } from './useFamilyActivityPicker.ios';
import { useManageApps } from './useManageApps.ios';
import { useManageAppsFocusRefresh } from './useManageAppsFocusRefresh';

/** Screen-level state for Manage Apps on iOS (FamilyActivityPicker + selected apps). */
export const useManageAppsScreen = () => {
  const { refreshInstalledApps, ...manageApps } = useManageApps();
  const { pickApps, isPicking } = useFamilyActivityPicker();

  const onPickApps = useCallback(() => {
    pickApps()
      .then(() => refreshInstalledApps(true))
      .catch(reportError);
  }, [pickApps, refreshInstalledApps]);

  useManageAppsFocusRefresh(refreshInstalledApps);

  return {
    ...manageApps,
    refreshInstalledApps,
    showSearchToolbar: false,
    showInstalledAppsList: false,
    onPickApps,
    isPickingApps: isPicking,
  };
};
