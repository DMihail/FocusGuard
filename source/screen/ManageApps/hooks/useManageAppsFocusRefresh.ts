import { useCallback } from 'react';

import { getManageAppKey } from '@/domain/appKey';
import { useRefreshWhenVisible } from '@/hooks/useRefreshWhenVisible';
import { selectedAppsStore, trackedUsageStore } from '@/store';
import { logDevWarning } from '@/utils/logDevWarning';

/** Refreshes installed apps and selected-app usage in a single focus handler. */
export const useManageAppsFocusRefresh = (refreshInstalledApps: () => void | Promise<void>): void => {
  const refreshOnFocus = useCallback(() => {
    Promise.resolve(refreshInstalledApps()).catch(logDevWarning);

    const appKeys = selectedAppsStore.getState().apps.map((app) => getManageAppKey(app));

    if (appKeys.length === 0) {
      return;
    }

    trackedUsageStore.getState().refreshUsage(appKeys, true).catch(logDevWarning);
  }, [refreshInstalledApps]);

  useRefreshWhenVisible(refreshOnFocus, { onAppActive: false });
};
