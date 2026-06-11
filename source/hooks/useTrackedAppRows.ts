import { useCallback, useEffect, useMemo } from 'react';

import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
import { appLimitsStore, selectedAppsStore, trackedUsageStore } from '@/store';
import { buildDashboardAppRows, type DashboardAppRow } from '@/utils/usage/dashboardStats';

export const useTrackedAppRows = (): {
  appRows: DashboardAppRow[];
  isRefreshingUsage: boolean;
  refreshUsage: (force?: boolean) => Promise<void>;
} => {
  const isFocused = useIsFocused();

  useEffect(() => {
    trackedUsageStore.getState().seedUsageFromCache();
  }, []);

  const selectedApps = selectedAppsStore((state) => state.apps);
  const selectedPackages = useMemo(() => selectedApps.map((app) => app.packageName), [selectedApps]);
  const { usageByPackage, isRefreshingUsage, refreshTrackedUsage } = trackedUsageStore(
    useShallow((state) => ({
      usageByPackage: state.usageByPackage,
      isRefreshingUsage: state.isRefreshingUsage,
      refreshTrackedUsage: state.refreshUsage,
    })),
  );
  const limitsByPackage = appLimitsStore(
    useShallow((state) =>
      Object.fromEntries(selectedPackages.map((packageName) => [packageName, state.limitsByPackage[packageName]])),
    ),
  );

  const refreshUsage = useCallback(
    (force = false) => refreshTrackedUsage(selectedPackages, force),
    [refreshTrackedUsage, selectedPackages],
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
    () => buildDashboardAppRows(selectedApps, limitsByPackage, usageByPackage),
    [limitsByPackage, selectedApps, usageByPackage],
  );

  return { appRows, isRefreshingUsage, refreshUsage };
};
