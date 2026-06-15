import { useCallback, useState } from 'react';

import { loadSyncedInstalledApps, readInstalledAppsCache } from '@/domain/loadSyncedInstalledApps';
import type { ManageApp } from '@/domain/types';

export const useInstalledAppsCatalog = () => {
  const [installedApps, setInstalledApps] = useState<ManageApp[]>(() => readInstalledAppsCache() ?? []);
  const [isLoadingApps, setIsLoadingApps] = useState(() => readInstalledAppsCache() === null);

  const refreshInstalledApps = useCallback(async (force = false) => {
    if (readInstalledAppsCache() === null) {
      setIsLoadingApps(true);
    }

    try {
      setInstalledApps(await loadSyncedInstalledApps(force));
    } finally {
      setIsLoadingApps(false);
    }
  }, []);

  return { installedApps, isLoadingApps, refreshInstalledApps };
};
