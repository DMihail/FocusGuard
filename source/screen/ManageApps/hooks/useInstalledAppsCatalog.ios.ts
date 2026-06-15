import { useCallback, useState } from 'react';

import { loadSyncedInstalledApps, readInstalledAppsCache } from '@/domain/loadSyncedInstalledApps';
import type { ManageApp } from '@/domain/types';

export const useInstalledAppsCatalog = () => {
  const [installedApps, setInstalledApps] = useState<ManageApp[]>(() => readInstalledAppsCache() ?? []);

  const refreshInstalledApps = useCallback(async (force = false) => {
    setInstalledApps(await loadSyncedInstalledApps(force));
  }, []);

  return { installedApps, isLoadingApps: false, refreshInstalledApps };
};
