import { create } from 'zustand';

import { getManageAppKey } from '@/domain/appKey';
import type { UsageByPackage } from '@/domain/usageStatsCatalog';
import { getCachedUsageByPackage, invalidateUsageStatsCache, loadUsageByPackage } from '@/domain/usageStatsCatalog';

import { selectedAppsStore } from './selectedAppsStore';
import type { TrackedUsageStore } from './types/trackedUsageStore';

let hasSeededFromCache = false;
let refreshInFlightCount = 0;

export const resetTrackedUsageSeedForTests = (): void => {
  hasSeededFromCache = false;
};

export const resetTrackedUsageRefreshForTests = (): void => {
  refreshInFlightCount = 0;
};

const seedUsageFromCache = (): void => {
  if (hasSeededFromCache) {
    return;
  }

  hasSeededFromCache = true;

  const cached = getCachedUsageByPackage();
  const appKeys = selectedAppsStore.getState().apps.map((app) => getManageAppKey(app));

  if (!cached || appKeys.length === 0) {
    return;
  }

  const picked: UsageByPackage = {};

  for (const appKey of appKeys) {
    const usageMs = cached[appKey];

    if (usageMs !== undefined) {
      picked[appKey] = usageMs;
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

export const trackedUsageStore = create<TrackedUsageStore>((set) => ({
  usageByPackage: {},
  isRefreshingUsage: false,

  seedUsageFromCache,

  refreshUsage: async (packageNames, force = false) => {
    if (packageNames.length === 0) {
      return;
    }

    refreshInFlightCount += 1;
    set({ isRefreshingUsage: true });

    try {
      if (force) {
        invalidateUsageStatsCache();
      }

      const nextUsage = await loadUsageByPackage(packageNames, force);

      set((state) => {
        const mergedUsage = { ...state.usageByPackage, ...nextUsage };

        return hasUsageChanged(state.usageByPackage, mergedUsage) ? { usageByPackage: mergedUsage } : state;
      });
    } finally {
      refreshInFlightCount -= 1;

      if (refreshInFlightCount <= 0) {
        refreshInFlightCount = 0;
        set({ isRefreshingUsage: false });
      }
    }
  },
}));
