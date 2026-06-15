import { useCallback, useEffect, useMemo } from 'react';

import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import { getManageAppKey } from '@/domain/appKey';
import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
import { appLimitsStore, selectedAppsStore, trackedUsageStore } from '@/store';
import { buildDashboardAppRows, type DashboardAppRow } from '@/utils/usage/dashboardStats';

export const useTrackedAppRows = (): {
  appRows: DashboardAppRow[];
  isRefreshingUsage: boolean;
  showUsageRefreshIndicator: boolean;
  refreshUsage: (force?: boolean) => Promise<void>;
} => {
  const isFocused = useIsFocused();

  useEffect(() => {
    trackedUsageStore.getState().seedUsageFromCache();
  }, []);

  const selectedApps = selectedAppsStore((state) => state.apps);
  const selectedAppKeys = useMemo(() => selectedApps.map((app) => getManageAppKey(app)), [selectedApps]);
  const { usageByPackage, isRefreshingUsage, refreshTrackedUsage } = trackedUsageStore(
    useShallow((state) => ({
      usageByPackage: state.usageByPackage,
      isRefreshingUsage: state.isRefreshingUsage,
      refreshTrackedUsage: state.refreshUsage,
    })),
  );
  const limitsByAppKey = appLimitsStore(
    useShallow((state) => Object.fromEntries(selectedAppKeys.map((appKey) => [appKey, state.limitsByAppKey[appKey]]))),
  );

  const refreshUsage = useCallback(
    (force = false) => refreshTrackedUsage(selectedAppKeys, force),
    [refreshTrackedUsage, selectedAppKeys],
  );

  const refreshOnFocus = useCallback(() => {
    refreshUsage().catch(() => undefined);
  }, [refreshUsage]);

  const refreshWhenActive = useCallback(() => {
    if (!isFocused) {
      return;
    }

    refreshOnFocus();
  }, [isFocused, refreshOnFocus]);

  useFocusEffect(refreshOnFocus);
  useAppStateOnActive(refreshWhenActive);

  const appRows = useMemo(
    () => buildDashboardAppRows(selectedApps, limitsByAppKey, usageByPackage),
    [limitsByAppKey, selectedApps, usageByPackage],
  );

  return {
    appRows,
    isRefreshingUsage,
    showUsageRefreshIndicator: isFocused && isRefreshingUsage,
    refreshUsage,
  };
};
