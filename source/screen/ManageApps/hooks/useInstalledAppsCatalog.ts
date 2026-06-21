import { useCallback, useState } from 'react';
import { Platform } from 'react-native';

import { getCachedInstalledApps, invalidateInstalledAppsCache, loadInstalledApps } from '@/domain/installedAppsCatalog';
import type { ManageApp } from '@/domain/types';
import { selectedAppsStore } from '@/store';

const trackCatalogLoading = Platform.OS === 'android';

export const useInstalledAppsCatalog = () => {
  const [installedApps, setInstalledApps] = useState<ManageApp[]>(() => getCachedInstalledApps() ?? []);
  const [isLoadingApps, setIsLoadingApps] = useState(() => trackCatalogLoading && getCachedInstalledApps() === null);

  const refreshInstalledApps = useCallback(async (force = false) => {
    if (trackCatalogLoading && getCachedInstalledApps() === null) {
      setIsLoadingApps(true);
    }

    try {
      if (force) {
        invalidateInstalledAppsCache();
      }

      const apps = await loadInstalledApps(force);
      selectedAppsStore.getState().syncSelectedAppsMetadata(apps);
      setInstalledApps(apps);
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
