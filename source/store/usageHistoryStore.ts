/** @format */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { compareLocalDayKeys } from '@/utils/usage/localDayKey';

import { zustandStorage } from './mmkv';
import { PERSIST_STORAGE_KEYS, USAGE_HISTORY_PERSIST_VERSION } from './persistSchema';
import type { DailyUsageHistoryEntry, UsageHistoryStore } from './types/usageHistoryStore';

const MAX_HISTORY_DAYS = 120;

const isUsageByAppKeyEqual = (left: Record<string, number>, right: Record<string, number>): boolean => {
  const leftKeys = Object.keys(left);

  if (leftKeys.length !== Object.keys(right).length) {
    return false;
  }

  return leftKeys.every((appKey) => left[appKey] === right[appKey]);
};

const areDailyEntriesEqual = (left: DailyUsageHistoryEntry, right: DailyUsageHistoryEntry): boolean =>
  left.totalUsedMs === right.totalUsedMs &&
  left.totalSavedMs === right.totalSavedMs &&
  left.focusScore === right.focusScore &&
  isUsageByAppKeyEqual(left.usageByAppKey, right.usageByAppKey);

const pruneHistory = (byDay: Record<string, DailyUsageHistoryEntry>): Record<string, DailyUsageHistoryEntry> => {
  const dayKeys = Object.keys(byDay).sort(compareLocalDayKeys);

  if (dayKeys.length <= MAX_HISTORY_DAYS) {
    return byDay;
  }

  const pruned: Record<string, DailyUsageHistoryEntry> = {};

  for (const dayKey of dayKeys.slice(0, MAX_HISTORY_DAYS)) {
    pruned[dayKey] = byDay[dayKey];
  }

  return pruned;
};

export const usageHistoryStore = create<UsageHistoryStore>()(
  persist(
    (set, get) => ({
      byDay: {},

      recordDay: (dayKey, entry) => {
        const existing = get().byDay[dayKey];

        if (existing && areDailyEntriesEqual(existing, entry)) {
          return;
        }

        set((state) => ({
          byDay: pruneHistory({
            ...state.byDay,
            [dayKey]: entry,
          }),
        }));
      },
    }),
    {
      name: PERSIST_STORAGE_KEYS.usageHistory,
      version: USAGE_HISTORY_PERSIST_VERSION,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ byDay: state.byDay }),
    },
  ),
);

export const resetUsageHistoryForTests = (): void => {
  usageHistoryStore.setState({ byDay: {} });
};
