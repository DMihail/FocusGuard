/** @format */

import { useCallback } from 'react';

import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { logDevWarning } from '@/utils/logDevWarning';

import { useFamilyActivityPicker } from './useFamilyActivityPicker.ios';
import { useManageApps } from './useManageApps.ios';

/** Screen-level state for Manage Apps on iOS (FamilyActivityPicker + selected apps). */
export const useManageAppsScreen = () => {
  const { refreshInstalledApps, ...manageApps } = useManageApps();
  const { pickApps, isPicking } = useFamilyActivityPicker();

  const onPickApps = useCallback(() => {
    pickApps()
      .then(() => refreshInstalledApps(true))
      .catch(logDevWarning);
  }, [pickApps, refreshInstalledApps]);

  useRefreshOnFocus(refreshInstalledApps);

  return {
    ...manageApps,
    refreshInstalledApps,
    showSearchToolbar: false,
    showInstalledAppsList: false,
    onPickApps,
    isPickingApps: isPicking,
  };
};
