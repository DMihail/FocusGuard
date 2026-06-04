/** @format */

import { useCallback, useMemo, useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
import { getAppsUsageStats } from '@/specs/NativeUsageStats';
import { appLimitsStore, selectedAppsStore } from '@/store';
import { buildDashboardAppRows, type DashboardAppRow } from '@/utils/usage/dashboardStats';

export const useTrackedAppRows = (): {
  appRows: DashboardAppRow[];
  refreshUsage: () => void;
} => {
  const selectedApps = selectedAppsStore((state) => state.apps);
  const limitsByPackage = appLimitsStore((state) => state.limitsByPackage);
  const getLimits = appLimitsStore((state) => state.getLimits);
  const [usageByPackage, setUsageByPackage] = useState<Record<string, number>>({});

  const refreshUsage = useCallback(() => {
    const stats = getAppsUsageStats();
    setUsageByPackage(Object.fromEntries(stats.map((item) => [item.packageName, item.totalTimeForeground])));
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshUsage();
    }, [refreshUsage]),
  );

  useAppStateOnActive(refreshUsage);

  const appRows = useMemo(
    () => buildDashboardAppRows(selectedApps, limitsByPackage, usageByPackage, getLimits),
    [getLimits, limitsByPackage, selectedApps, usageByPackage],
  );

  return { appRows, refreshUsage };
};
