import { useCallback, useState } from 'react';

import { loadSyncedInstalledApps, readInstalledAppsCache } from '@/domain/loadSyncedInstalledApps';
import type { ManageApp } from '@/domain/types';

import { trackCatalogLoading } from './trackCatalogLoading';

export const useInstalledAppsCatalog = () => {
  const [installedApps, setInstalledApps] = useState<ManageApp[]>(() => readInstalledAppsCache() ?? []);
  const [isLoadingApps, setIsLoadingApps] = useState(() => trackCatalogLoading && readInstalledAppsCache() === null);

  const refreshInstalledApps = useCallback(async (force = false) => {
    if (trackCatalogLoading && readInstalledAppsCache() === null) {
      setIsLoadingApps(true);
    }

    try {
      setInstalledApps(await loadSyncedInstalledApps(force));
    } finally {
      if (trackCatalogLoading) {
        setIsLoadingApps(false);
      }
    }
  }, []);

  return {
    installedApps,
    isLoadingApps: trackCatalogLoading ? isLoadingApps : false,
    refreshInstalledApps,
  };
};
