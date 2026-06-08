import { useCallback, useMemo } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
import { appLimitsStore, selectedAppsStore, trackedUsageStore } from '@/store';
import { buildDashboardAppRows, type DashboardAppRow } from '@/utils/usage/dashboardStats';

export { resetTrackedUsageSeedForTests } from '@/store/trackedUsageStore';

export const useTrackedAppRows = (): {
  appRows: DashboardAppRow[];
  refreshUsage: (force?: boolean) => Promise<void>;
} => {
  trackedUsageStore.getState().seedUsageFromCache();

  const selectedApps = selectedAppsStore((state) => state.apps);
  const selectedPackages = useMemo(() => selectedApps.map((app) => app.packageName), [selectedApps]);
  const { usageByPackage, refreshTrackedUsage } = trackedUsageStore(
    useShallow((state) => ({
      usageByPackage: state.usageByPackage,
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

  useFocusEffect(refreshOnFocus);
  useAppStateOnActive(refreshOnFocus);

  const appRows = useMemo(
    () => buildDashboardAppRows(selectedApps, limitsByPackage, usageByPackage),
    [limitsByPackage, selectedApps, usageByPackage],
  );

  return { appRows, refreshUsage };
};
