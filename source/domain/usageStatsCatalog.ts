import * as NativeSpecs from '@/specs';
import { selectedAppsStore } from '@/store/selectedAppsStore';

import { createNativeKeyedCatalogLoader } from './createNativeCatalogLoader';

export type UsageByPackage = Record<string, number>;

const readUsageForPackages = (packageNames: readonly string[]): UsageByPackage => {
  const usageByPackage: UsageByPackage = {};

  for (const packageName of packageNames) {
    usageByPackage[packageName] = NativeSpecs.getPackageUsageToday(packageName);
  }

  return usageByPackage;
};

const usageStatsCatalog = createNativeKeyedCatalogLoader<UsageByPackage>({
  label: 'usageStatsCatalog',
  readKeys: readUsageForPackages,
  onInvalidate: () => NativeSpecs.invalidateNativeCatalogCaches?.(),
});

export const getCachedUsageByPackage = usageStatsCatalog.getCached;
export const invalidateUsageStatsCache = usageStatsCatalog.invalidate;
export const loadUsageByPackage = usageStatsCatalog.loadForKeys;

export const prefetchUsageStats = (): void => {
  const packageNames = selectedAppsStore.getState().apps.map((app) => app.packageName);

  if (packageNames.length === 0) {
    return;
  }

  usageStatsCatalog.prefetch(packageNames);
};
