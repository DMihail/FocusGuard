/** @format */

import { useManageApps } from './useManageApps.android';
import { useManageAppsFocusRefresh } from './useManageAppsFocusRefresh';

/** Screen-level state for Manage Apps on Android (catalog search + filters). */
export const useManageAppsScreen = () => {
  const { refreshInstalledApps, ...manageApps } = useManageApps();

  useManageAppsFocusRefresh(refreshInstalledApps);

  return {
    ...manageApps,
    showSearchToolbar: true,
    showInstalledAppsList: true,
    onPickApps: undefined,
    isPickingApps: false,
  };
};
