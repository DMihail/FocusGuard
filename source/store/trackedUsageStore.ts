import { create } from 'zustand';

import { invalidateInstalledAppsCache, loadInstalledApps } from '@/domain/installedAppsCatalog';
import { getCachedUsageByPackage, invalidateUsageStatsCache, loadUsageByPackage } from '@/domain/usageStatsCatalog';

import { selectedAppsStore } from './selectedAppsStore';

type UsageByPackage = Record<string, number>;

let hasSeededFromCache = false;

export const resetTrackedUsageSeedForTests = (): void => {
  hasSeededFromCache = false;
};

const seedUsageFromCache = (): void => {
  if (hasSeededFromCache) {
    return;
  }

  hasSeededFromCache = true;

  const cached = getCachedUsageByPackage();
  const packageNames = selectedAppsStore.getState().apps.map((app) => app.packageName);

  if (!cached || packageNames.length === 0) {
    return;
  }

  const picked: UsageByPackage = {};

  for (const packageName of packageNames) {
    const usageMs = cached[packageName];

    if (usageMs !== undefined) {
      picked[packageName] = usageMs;
    }
  }

  if (Object.keys(picked).length > 0) {
    trackedUsageStore.setState({ usageByPackage: picked });
  }
};

const hasUsageChanged = (previous: UsageByPackage, next: UsageByPackage): boolean => {
  const previousKeys = Object.keys(previous);
  const nextKeys = Object.keys(next);

  if (previousKeys.length !== nextKeys.length) {
    return true;
  }

  return nextKeys.some((key) => previous[key] !== next[key]);
};

type TrackedUsageStore = {
  usageByPackage: UsageByPackage;
  isRefreshingUsage: boolean;
  seedUsageFromCache: () => void;
  refreshUsage: (packageNames: readonly string[], force?: boolean) => Promise<void>;
};

export const trackedUsageStore = create<TrackedUsageStore>((set, get) => ({
  usageByPackage: {},
  isRefreshingUsage: false,

  seedUsageFromCache,

  refreshUsage: async (packageNames, force = false) => {
    if (packageNames.length === 0) {
      const { usageByPackage } = get();

      if (Object.keys(usageByPackage).length === 0) {
        return;
      }

      set({ usageByPackage: {} });
      return;
    }

    set({ isRefreshingUsage: true });

    try {
      if (force) {
        invalidateUsageStatsCache();
        invalidateInstalledAppsCache();
      }

      const nextUsage = await loadUsageByPackage(packageNames, force);

      if (force) {
        const installedApps = await loadInstalledApps(true);
        selectedAppsStore.getState().syncSelectedAppsMetadata(installedApps);
      }

      set((state) => (hasUsageChanged(state.usageByPackage, nextUsage) ? { usageByPackage: nextUsage } : state));
    } finally {
      set({ isRefreshingUsage: false });
    }
  },
}));
