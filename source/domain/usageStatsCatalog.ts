import * as NativeSpecs from '@/specs';
import { selectedAppsStore } from '@/store/selectedAppsStore';

import { getManageAppKey } from './appKey';
import { createNativeKeyedCatalogLoader } from './createNativeCatalogLoader';

export type UsageByPackage = Record<string, number>;

const readUsageForPackages = async (packageNames: readonly string[]): Promise<UsageByPackage> => {
  const entries = await NativeSpecs.getPackagesUsageToday(packageNames);

  return Object.fromEntries(entries.map((entry) => [entry.packageName, entry.usageMs]));
};

const usageStatsCatalog = createNativeKeyedCatalogLoader<UsageByPackage>({
  readKeys: readUsageForPackages,
  onInvalidate: () => NativeSpecs.invalidateNativeCatalogCaches?.(),
});

export const getCachedUsageByPackage = usageStatsCatalog.getCached;
export const invalidateUsageStatsCache = usageStatsCatalog.invalidate;
export const loadUsageByPackage = usageStatsCatalog.loadForKeys;

export const prefetchUsageStats = (): void => {
  const appKeys = selectedAppsStore.getState().apps.map((app) => getManageAppKey(app));

  if (appKeys.length === 0) {
    return;
  }

  usageStatsCatalog.prefetch(appKeys);
};
