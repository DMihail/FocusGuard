import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useIsFocused } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import { getManageAppKey } from '@/domain/appKey';
import { useCoreStoresHydrated } from '@/hooks/useCoreStoresHydrated';
import { useLocalDayChangeRefresh } from '@/hooks/useLocalDayChangeRefresh';
import { useRefreshWhenVisible } from '@/hooks/useRefreshWhenVisible';
import { appLimitsStore, selectedAppsStore, trackedUsageStore } from '@/store';
import type { AppLimits, AppLimitsByAppKey } from '@/store/types/appLimits';
import { logDevWarning } from '@/utils/logDevWarning';
import { buildDashboardAppRows, type DashboardAppRow } from '@/utils/usage/dashboardStats';

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

export const useTrackedAppRows = (): {
  appRows: DashboardAppRow[];
  showUsageRefreshIndicator: boolean;
  refreshUsage: (force?: boolean) => Promise<void>;
} => {
  const isFocused = useIsFocused();
  const hasCoreStoresHydrated = useCoreStoresHydrated();

  const selectedApps = selectedAppsStore((state) => state.apps);
  const selectedAppKeys = useMemo(() => selectedApps.map((app) => getManageAppKey(app)), [selectedApps]);
  const selectedAppKeysKey = selectedAppKeys.join('\0');
  const usageByPackage = trackedUsageStore(
    useShallow((state) => pickUsageForSelectedApps(state.usageByPackage, selectedAppKeys)),
  );
  const isRefreshingUsage = trackedUsageStore((state) => state.isRefreshingUsage);
  const limitsByAppKey = appLimitsStore(
    useShallow((state) => pickLimitsForSelectedApps(state.limitsByAppKey, selectedAppKeys)),
  );

  const selectedAppKeysRef = useRef(selectedAppKeys);
  selectedAppKeysRef.current = selectedAppKeys;

  const refreshUsage = useCallback(
    (force = false) => {
      const appKeys = selectedAppKeysRef.current;

      if (!hasCoreStoresHydrated || appKeys.length === 0) {
        return Promise.resolve();
      }

      return trackedUsageStore.getState().refreshUsage(appKeys, force);
    },
    [hasCoreStoresHydrated],
  );

  useEffect(() => {
    if (!hasCoreStoresHydrated) {
      return;
    }

    trackedUsageStore.getState().seedUsageFromCache();

    if (selectedAppKeys.length === 0) {
      return;
    }

    refreshUsage(false).catch(logDevWarning);
  }, [hasCoreStoresHydrated, refreshUsage, selectedAppKeys.length, selectedAppKeysKey]);

  const refreshUsageSoft = useCallback(() => refreshUsage(false), [refreshUsage]);
  const refreshUsageHard = useCallback(() => refreshUsage(true), [refreshUsage]);

  useRefreshWhenVisible(refreshUsageSoft);
  useLocalDayChangeRefresh(refreshUsageHard);

  const appRows = useMemo(
    () => buildDashboardAppRows(selectedApps, limitsByAppKey, usageByPackage),
    [limitsByAppKey, selectedApps, usageByPackage],
  );

  return {
    appRows,
    showUsageRefreshIndicator: isFocused && isRefreshingUsage,
    refreshUsage,
  };
};
