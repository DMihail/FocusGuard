import * as NativeSpecs from '@/specs';

import { createNativeKeyedCatalogLoader } from './createNativeCatalogLoader';

export type UsageByPackage = Record<string, number>;

const readUsageForPackages = async (packageNames: readonly string[]): Promise<UsageByPackage> => {
  const entries = await NativeSpecs.getPackagesUsageToday(packageNames);

  return Object.fromEntries(entries.map((entry) => [entry.packageName, entry.usageMs]));
};

const usageStatsCatalog = createNativeKeyedCatalogLoader<UsageByPackage>({
  readKeys: readUsageForPackages,
  onInvalidate: () => NativeSpecs.invalidateNativeUsageCache?.(),
});

export const getCachedUsageByPackage = usageStatsCatalog.getCached;
export const invalidateUsageStatsCache = usageStatsCatalog.invalidate;
export const loadUsageByPackage = usageStatsCatalog.loadForKeys;
