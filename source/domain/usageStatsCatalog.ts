/** @format */

import { getAppsUsageStats, getPackageUsageToday } from '@/specs';
import { scheduleAfterInteractions } from '@/utils/scheduleAfterInteractions';

type UsageByPackage = Record<string, number>;

let cachedUsageByPackage: UsageByPackage | null = null;
let loadPromise: Promise<UsageByPackage> | null = null;

const readAllUsage = (): UsageByPackage =>
  Object.fromEntries(getAppsUsageStats().map((item) => [item.packageName, item.totalTimeForeground]));

const pickUsageForPackages = (usageByPackage: UsageByPackage, packageNames: readonly string[]): UsageByPackage => {
  if (packageNames.length === 0) {
    return {};
  }

  const packages = new Set(packageNames);
  const picked: UsageByPackage = {};

  for (const packageName of packages) {
    const usageMs = usageByPackage[packageName];
    if (usageMs !== undefined) {
      picked[packageName] = usageMs;
    }
  }

  return picked;
};

export const getCachedUsageByPackage = (): UsageByPackage | null => cachedUsageByPackage;

export const invalidateUsageStatsCache = (): void => {
  cachedUsageByPackage = null;
  loadPromise = null;
};

export const loadUsageByPackage = (packageNames: readonly string[], force = false): Promise<UsageByPackage> => {
  if (!force && cachedUsageByPackage) {
    return Promise.resolve(pickUsageForPackages(cachedUsageByPackage, packageNames));
  }

  if (!force && loadPromise) {
    return loadPromise.then((usageByPackage) => pickUsageForPackages(usageByPackage, packageNames));
  }

  loadPromise = new Promise((resolve) => {
    scheduleAfterInteractions(() => {
      try {
        const usageByPackage = readAllUsage();
        cachedUsageByPackage = usageByPackage;
        resolve(usageByPackage);
      } catch (error) {
        cachedUsageByPackage = {};
        resolve({});
        if (__DEV__) {
          console.warn('[usageStatsCatalog] Failed to load usage stats', error);
        }
      } finally {
        loadPromise = null;
      }
    });
  });

  return loadPromise.then((usageByPackage) => pickUsageForPackages(usageByPackage, packageNames));
};

export const loadPackageUsageToday = (packageName: string): Promise<number> =>
  new Promise((resolve) => {
    scheduleAfterInteractions(() => {
      try {
        resolve(getPackageUsageToday(packageName));
      } catch (error) {
        resolve(0);
        if (__DEV__) {
          console.warn('[usageStatsCatalog] Failed to load package usage', error);
        }
      }
    });
  });

export const prefetchUsageStats = (): void => {
  loadUsageByPackage([], false).catch(() => undefined);
};
