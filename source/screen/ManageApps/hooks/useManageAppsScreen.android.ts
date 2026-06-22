/** @format */

import { useRefreshWhenVisible } from '@/hooks/useRefreshWhenVisible';

import { useManageApps } from './useManageApps.android';

/** Screen-level state for Manage Apps on Android (catalog search + filters). */
export const useManageAppsScreen = () => {
  const { refreshInstalledApps, ...manageApps } = useManageApps();

  useRefreshWhenVisible(refreshInstalledApps, { onAppActive: false });

  return {
    ...manageApps,
    showSearchToolbar: true,
    showInstalledAppsList: true,
    onPickApps: undefined,
    isPickingApps: false,
  };
};
