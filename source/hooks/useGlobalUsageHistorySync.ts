/** @format */

import { useMemo } from 'react';

import { useShallow } from 'zustand/react/shallow';

import { getManageAppKey } from '@/domain/appKey';
import { useCoreStoresHydrated } from '@/hooks/useCoreStoresHydrated';
import { appLimitsStore, selectedAppsStore, trackedUsageStore } from '@/store';
import type { AppLimits, AppLimitsByAppKey } from '@/store/types/appLimits';
import { buildDashboardAppRows } from '@/utils/usage/dashboardStats';

import { useUsageHistorySync } from './useUsageHistorySync';

const pickLimitsForSelectedApps = (
  limitsByAppKey: AppLimitsByAppKey,
  selectedAppKeys: readonly string[],
): Record<string, AppLimits> => {
  const picked: Record<string, AppLimits> = {};

  for (const appKey of selectedAppKeys) {
    const limits = limitsByAppKey[appKey];

    if (limits) {
      picked[appKey] = limits;
    }
  }

  return picked;
};

const pickUsageForSelectedApps = (
  usageByPackage: Record<string, number>,
  selectedAppKeys: readonly string[],
): Record<string, number> => {
  const picked: Record<string, number> = {};

  for (const appKey of selectedAppKeys) {
    picked[appKey] = usageByPackage[appKey] ?? 0;
  }

  return picked;
};

/** Single app-wide writer for daily usage history snapshots. */
export const useGlobalUsageHistorySync = (enabled: boolean): void => {
  const hasCoreStoresHydrated = useCoreStoresHydrated();
  const selectedApps = selectedAppsStore((state) => state.apps);
  const selectedAppKeys = useMemo(() => selectedApps.map((app) => getManageAppKey(app)), [selectedApps]);
  const usageByPackage = trackedUsageStore(
    useShallow((state) => pickUsageForSelectedApps(state.usageByPackage, selectedAppKeys)),
  );
  const limitsByAppKey = appLimitsStore(
    useShallow((state) => pickLimitsForSelectedApps(state.limitsByAppKey, selectedAppKeys)),
  );

  const appRows = useMemo(
    () => buildDashboardAppRows(selectedApps, limitsByAppKey, usageByPackage),
    [limitsByAppKey, selectedApps, usageByPackage],
  );

  useUsageHistorySync(appRows, enabled && hasCoreStoresHydrated);
};
