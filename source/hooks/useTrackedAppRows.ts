import { useCallback, useEffect, useMemo } from 'react';

import { useIsFocused } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import { getManageAppKey } from '@/domain/appKey';
import { usePersistHydrated } from '@/hooks/usePersistHydrated';
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

export const useTrackedAppRows = (): {
  appRows: DashboardAppRow[];
  showUsageRefreshIndicator: boolean;
  refreshUsage: (force?: boolean) => Promise<void>;
} => {
  const isFocused = useIsFocused();
  const hasSelectedAppsHydrated = usePersistHydrated(selectedAppsStore);

  const selectedApps = selectedAppsStore((state) => state.apps);
  const selectedAppKeys = useMemo(() => selectedApps.map((app) => getManageAppKey(app)), [selectedApps]);
  const selectedAppKeysKey = selectedAppKeys.join('\0');
  const { usageByPackage, isRefreshingUsage } = trackedUsageStore(
    useShallow((state) => ({
      usageByPackage: state.usageByPackage,
      isRefreshingUsage: state.isRefreshingUsage,
    })),
  );
  const allLimitsByAppKey = appLimitsStore((state) => state.limitsByAppKey);
  const limitsByAppKey = useMemo(
    () => pickLimitsForSelectedApps(allLimitsByAppKey, selectedAppKeys),
    [allLimitsByAppKey, selectedAppKeys],
  );

  const refreshUsage = useCallback(
    (force = false) => {
      if (!hasSelectedAppsHydrated || selectedAppKeys.length === 0) {
        return Promise.resolve();
      }

      return trackedUsageStore.getState().refreshUsage(selectedAppKeys, force);
    },
    [hasSelectedAppsHydrated, selectedAppKeys],
  );

  useEffect(() => {
    if (!hasSelectedAppsHydrated) {
      return;
    }

    trackedUsageStore.getState().seedUsageFromCache();

    if (selectedAppKeys.length === 0) {
      return;
    }

    refreshUsage(true).catch(logDevWarning);
  }, [hasSelectedAppsHydrated, refreshUsage, selectedAppKeys.length, selectedAppKeysKey]);

  const refreshUsageOnVisible = useCallback(() => refreshUsage(true), [refreshUsage]);

  useRefreshWhenVisible(refreshUsageOnVisible);

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
