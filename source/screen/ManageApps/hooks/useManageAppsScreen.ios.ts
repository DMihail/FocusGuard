/** @format */

import { useCallback } from 'react';

import { useRefreshWhenVisible } from '@/hooks/useRefreshWhenVisible';
import { logDevWarning } from '@/utils/logDevWarning';

import { useFamilyActivityPicker } from './useFamilyActivityPicker.ios';
import { useManageApps } from './useManageApps.ios';
import { useRefreshSelectedAppsUsage } from './useRefreshSelectedAppsUsage';

/** Screen-level state for Manage Apps on iOS (FamilyActivityPicker + selected apps). */
export const useManageAppsScreen = () => {
  const { refreshInstalledApps, ...manageApps } = useManageApps();
  const { pickApps, isPicking } = useFamilyActivityPicker();

  const onPickApps = useCallback(() => {
    pickApps()
      .then(() => refreshInstalledApps(true))
      .catch(logDevWarning);
  }, [pickApps, refreshInstalledApps]);

  useRefreshWhenVisible(refreshInstalledApps, { onAppActive: false });
  useRefreshSelectedAppsUsage();

  return {
    ...manageApps,
    refreshInstalledApps,
    showSearchToolbar: false,
    showInstalledAppsList: false,
    onPickApps,
    isPickingApps: isPicking,
  };
};
