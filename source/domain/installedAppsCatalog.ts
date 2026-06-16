import { mapInstalledApps } from '@/domain/mapInstalledApps';
import type { ManageApp } from '@/domain/types';
import * as NativeSpecs from '@/specs';

import { createNativeCatalogLoader } from './createNativeCatalogLoader';

const installedAppsCatalog = createNativeCatalogLoader<ManageApp[]>({
  fallback: [],
  read: async () => mapInstalledApps(await NativeSpecs.getInstalledApplications()),
  onInvalidate: () => NativeSpecs.invalidateNativeCatalogCaches?.(),
});

export const getCachedInstalledApps = installedAppsCatalog.getCached;
export const invalidateInstalledAppsCache = installedAppsCatalog.invalidate;
export const loadInstalledApps = installedAppsCatalog.load;
export const prefetchInstalledApps = installedAppsCatalog.prefetch;
