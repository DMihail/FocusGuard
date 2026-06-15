import { getCachedInstalledApps, invalidateInstalledAppsCache, loadInstalledApps } from '@/domain/installedAppsCatalog';
import type { ManageApp } from '@/domain/types';
import { selectedAppsStore } from '@/store';

export const loadSyncedInstalledApps = async (force = false): Promise<ManageApp[]> => {
  if (force) {
    invalidateInstalledAppsCache();
  }

  const apps = await loadInstalledApps(force);
  selectedAppsStore.getState().syncSelectedAppsMetadata(apps);
  return apps;
};

export const readInstalledAppsCache = (): ManageApp[] | null => getCachedInstalledApps();
