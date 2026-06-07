import type { ManageApp } from '@/screen/ManageApps/types';
import { mapInstalledApps } from '@/screen/ManageApps/utils/mapInstalledApps';
import * as NativeSpecs from '@/specs';

import { createNativeCatalogLoader } from './createNativeCatalogLoader';

const installedAppsCatalog = createNativeCatalogLoader<ManageApp[]>({
  label: 'installedAppsCatalog',
  fallback: [],
  read: () => mapInstalledApps(NativeSpecs.getInstalledApplications()),
  onInvalidate: () => NativeSpecs.invalidateNativeCatalogCaches?.(),
});

export const getCachedInstalledApps = installedAppsCatalog.getCached;
export const invalidateInstalledAppsCache = installedAppsCatalog.invalidate;
export const loadInstalledApps = installedAppsCatalog.load;
export const prefetchInstalledApps = installedAppsCatalog.prefetch;
