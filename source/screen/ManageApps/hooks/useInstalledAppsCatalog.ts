/** @format */

import { useCallback, useState } from 'react';

import { getCachedInstalledApps, invalidateInstalledAppsCache, loadInstalledApps } from '@/domain/installedAppsCatalog';
import type { ManageApp } from '@/domain/types';
import { selectedAppsStore } from '@/store';

/** Loads and caches the device app catalog for Manage Apps. */
export const useInstalledAppsCatalog = () => {
  const [installedApps, setInstalledApps] = useState<ManageApp[]>(() => getCachedInstalledApps() ?? []);
  const [isLoadingApps, setIsLoadingApps] = useState(() => getCachedInstalledApps() === null);

  const refreshInstalledApps = useCallback(async (force = false) => {
    if (force) {
      invalidateInstalledAppsCache();
    }

    const hasCachedApps = getCachedInstalledApps() !== null;

    if (!hasCachedApps) {
      setIsLoadingApps(true);
    }

    const apps = await loadInstalledApps(force);
    selectedAppsStore.getState().syncSelectedAppsMetadata(apps);
    setInstalledApps(apps);
    setIsLoadingApps(false);
  }, []);

  return { installedApps, isLoadingApps, refreshInstalledApps };
};
