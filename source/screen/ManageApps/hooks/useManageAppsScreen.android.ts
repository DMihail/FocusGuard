/** @format */

import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';

import { useManageApps } from './useManageApps.android';

/** Screen-level state for Manage Apps on Android (catalog search + filters). */
export const useManageAppsScreen = () => {
  const { refreshInstalledApps, ...manageApps } = useManageApps();

  useRefreshOnFocus(refreshInstalledApps);

  return {
    ...manageApps,
    refreshInstalledApps,
    showSearchToolbar: true,
    showInstalledAppsList: true,
    onPickApps: undefined,
    isPickingApps: false,
  };
};
