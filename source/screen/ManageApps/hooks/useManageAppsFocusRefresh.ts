import { useCallback } from 'react';

import { reportError } from '@/crashlytics/reportError';
import { getManageAppKey } from '@/domain/appKey';
import { useRefreshWhenVisible } from '@/hooks/useRefreshWhenVisible';
import { selectedAppsStore, trackedUsageStore } from '@/store';

/** Refreshes installed apps and selected-app usage in a single focus handler. */
export const useManageAppsFocusRefresh = (refreshInstalledApps: () => void | Promise<void>): void => {
  const refreshOnFocus = useCallback(() => {
    Promise.resolve(refreshInstalledApps()).catch(reportError);

    const appKeys = selectedAppsStore.getState().apps.map((app) => getManageAppKey(app));

    if (appKeys.length === 0) {
      return;
    }

    trackedUsageStore.getState().refreshUsage(appKeys, false).catch(reportError);
  }, [refreshInstalledApps]);

  useRefreshWhenVisible(refreshOnFocus, { onAppActive: false });
};
