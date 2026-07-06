import { create } from 'zustand';

import { reportError } from '@/crashlytics/reportError';
import { getManageAppKey } from '@/domain/appKey';
import type { UsageByPackage } from '@/domain/usageStatsCatalog';
import { getCachedUsageByPackage, invalidateUsageStatsCache, loadUsageByPackage } from '@/domain/usageStatsCatalog';
import { getLocalDayKey } from '@/utils/usage/localDayKey';

import { selectedAppsStore } from './selectedAppsStore';
import type { TrackedUsageStore } from './types/trackedUsageStore';

type TrackedUsageSetState = (
  partial: Partial<TrackedUsageStore> | ((state: TrackedUsageStore) => Partial<TrackedUsageStore> | TrackedUsageStore),
) => void;

let hasSeededFromCache = false;
let refreshWaiterCount = 0;
let usageDayKey: string | null = null;
let pendingRefreshKeys = new Set<string>();
let pendingRefreshForce = false;
let refreshDrainPromise: Promise<void> | null = null;

export const resetTrackedUsageSeedForTests = (): void => {
  hasSeededFromCache = false;
  usageDayKey = null;
};

export const resetTrackedUsageRefreshForTests = (): void => {
  refreshWaiterCount = 0;
  pendingRefreshKeys = new Set();
  pendingRefreshForce = false;
  refreshDrainPromise = null;
};

const resetUsageForNewDay = (): void => {
  hasSeededFromCache = false;
  invalidateUsageStatsCache();
  trackedUsageStore.setState({ usageByPackage: {} });
};

/** Clears cached usage when the local day changes. Returns true if the day rolled over. */
export const ensureCurrentUsageDay = (): boolean => {
  const today = getLocalDayKey();

  if (usageDayKey === today) {
    return false;
  }

  usageDayKey = today;
  resetUsageForNewDay();

  return true;
};

const seedUsageFromCache = (): void => {
  ensureCurrentUsageDay();

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

const mergeUsageForKeys = (
  previous: UsageByPackage,
  nextUsage: UsageByPackage,
  packageNames: readonly string[],
  force: boolean,
): UsageByPackage => {
  if (!force) {
    return { ...previous, ...nextUsage };
  }

  const merged: UsageByPackage = {};

  for (const appKey of packageNames) {
    const usageMs = nextUsage[appKey] ?? previous[appKey];

    if (usageMs !== undefined) {
      merged[appKey] = usageMs;
    }
  }

  return merged;
};

const runRefreshBatch = async (
  packageNames: readonly string[],
  force: boolean,
  set: TrackedUsageSetState,
): Promise<void> => {
  const dayChanged = ensureCurrentUsageDay();

  if (force || dayChanged) {
    invalidateUsageStatsCache();
  }

  const shouldForce = force || dayChanged;
  const nextUsage = await loadUsageByPackage(packageNames, shouldForce).catch((error) => {
    reportError(error);
    throw error;
  });

  set((state) => {
    const mergedUsage = mergeUsageForKeys(state.usageByPackage, nextUsage, packageNames, shouldForce);

    return hasUsageChanged(state.usageByPackage, mergedUsage) ? { usageByPackage: mergedUsage } : state;
  });
};

const drainPendingRefresh = (set: TrackedUsageSetState): Promise<void> => {
  const run = async (): Promise<void> => {
    while (pendingRefreshKeys.size > 0) {
      const packageNames = [...pendingRefreshKeys];
      const force = pendingRefreshForce;

      pendingRefreshKeys = new Set();
      pendingRefreshForce = false;

      await runRefreshBatch(packageNames, force, set);
    }
  };

  return run();
};

export const trackedUsageStore = create<TrackedUsageStore>((set) => ({
  usageByPackage: {},
  isRefreshingUsage: false,

  seedUsageFromCache,

  refreshUsage: async (packageNames, force = false) => {
    if (packageNames.length === 0) {
      return;
    }

    for (const appKey of packageNames) {
      pendingRefreshKeys.add(appKey);
    }

    pendingRefreshForce = pendingRefreshForce || force;

    refreshWaiterCount += 1;

    if (refreshWaiterCount === 1) {
      set({ isRefreshingUsage: true });
    }

    if (!refreshDrainPromise) {
      refreshDrainPromise = Promise.resolve()
        .then(() => drainPendingRefresh(set))
        .finally(() => {
          refreshDrainPromise = null;
        });
    }

    try {
      await refreshDrainPromise;
    } finally {
      refreshWaiterCount -= 1;

      if (refreshWaiterCount <= 0) {
        refreshWaiterCount = 0;
        set({ isRefreshingUsage: false });
      }
    }
  },
}));
