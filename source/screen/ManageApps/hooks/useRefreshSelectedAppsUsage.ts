import { useCallback } from 'react';

import { getManageAppKey } from '@/domain/appKey';
import { useRefreshWhenVisible } from '@/hooks/useRefreshWhenVisible';
import { selectedAppsStore, trackedUsageStore } from '@/store';

/** Keeps today's usage fresh while picking apps (Configure Limits reads the same store). */
export const useRefreshSelectedAppsUsage = (): void => {
  const refreshUsage = useCallback(() => {
    const appKeys = selectedAppsStore.getState().apps.map((app) => getManageAppKey(app));

    if (appKeys.length === 0) {
      return Promise.resolve();
    }

    return trackedUsageStore.getState().refreshUsage(appKeys, true);
  }, []);

  useRefreshWhenVisible(refreshUsage);
};
