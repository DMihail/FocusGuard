/** @format */

import { useCallback, useState } from 'react';

import { getCachedInstalledApps, invalidateInstalledAppsCache, loadInstalledApps } from '@/domain/installedAppsCatalog';
import type { ManageApp } from '@/domain/types';
import { selectedAppsStore } from '@/store';

/** Refreshes the Screen Time picker selection shown on Manage Apps for iOS. */
export const useInstalledAppsCatalog = () => {
  const [installedApps, setInstalledApps] = useState<ManageApp[]>(() => getCachedInstalledApps() ?? []);

  const refreshInstalledApps = useCallback(async (force = false) => {
    if (force) {
      invalidateInstalledAppsCache();
    }

    const apps = await loadInstalledApps(force);
    selectedAppsStore.getState().syncSelectedAppsMetadata(apps);
    setInstalledApps(apps);
  }, []);

  return { installedApps, isLoadingApps: false, refreshInstalledApps };
};
