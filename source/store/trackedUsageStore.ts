import { create } from 'zustand';

import { invalidateInstalledAppsCache, loadInstalledApps } from '@/domain/installedAppsCatalog';
import { invalidateUsageStatsCache, loadUsageByPackage } from '@/domain/usageStatsCatalog';

import { selectedAppsStore } from './selectedAppsStore';

type UsageByPackage = Record<string, number>;

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
  refreshUsage: (packageNames: readonly string[], force?: boolean) => Promise<void>;
  resetUsage: () => void;
};

export const trackedUsageStore = create<TrackedUsageStore>((set, get) => ({
  usageByPackage: {},

  resetUsage: () => {
    set({ usageByPackage: {} });
  },

  refreshUsage: async (packageNames, force = false) => {
    if (packageNames.length === 0) {
      const { usageByPackage } = get();

      if (Object.keys(usageByPackage).length === 0) {
        return;
      }

      set({ usageByPackage: {} });
      return;
    }

    if (force) {
      invalidateUsageStatsCache();
      invalidateInstalledAppsCache();
    }

    const [installedApps, nextUsage] = await Promise.all([
      loadInstalledApps(force),
      loadUsageByPackage(packageNames, force),
    ]);

    selectedAppsStore.getState().syncSelectedAppsMetadata(installedApps);

    set((state) => (hasUsageChanged(state.usageByPackage, nextUsage) ? { usageByPackage: nextUsage } : state));
  },
}));
