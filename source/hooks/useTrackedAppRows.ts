/** @format */

import { useCallback, useMemo, useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
import { getAppsUsageStats } from '@/specs/NativeUsageStats';
import { appLimitsStore, selectedAppsStore } from '@/store';
import { buildDashboardAppRows, type DashboardAppRow } from '@/utils/usage/dashboardStats';

const hasUsageChanged = (previous: Record<string, number>, next: Record<string, number>): boolean => {
  const previousKeys = Object.keys(previous);
  const nextKeys = Object.keys(next);

  if (previousKeys.length !== nextKeys.length) {
    return true;
  }

  return nextKeys.some((key) => previous[key] !== next[key]);
};

export const useTrackedAppRows = (): {
  appRows: DashboardAppRow[];
  refreshUsage: () => void;
} => {
  const selectedApps = selectedAppsStore((state) => state.apps);
  const selectedPackages = useMemo(() => selectedApps.map((app) => app.packageName), [selectedApps]);
  const limitsByPackage = appLimitsStore(
    useShallow((state) =>
      Object.fromEntries(selectedPackages.map((packageName) => [packageName, state.limitsByPackage[packageName]])),
    ),
  );
  const [usageByPackage, setUsageByPackage] = useState<Record<string, number>>({});

  const refreshUsage = useCallback(() => {
    const packages = new Set(selectedPackages);

    if (packages.size === 0) {
      setUsageByPackage((previous) => (Object.keys(previous).length === 0 ? previous : {}));
      return;
    }

    const stats = getAppsUsageStats();
    const nextUsage = Object.fromEntries(
      stats
        .filter((item) => packages.has(item.packageName))
        .map((item) => [item.packageName, item.totalTimeForeground]),
    );

    setUsageByPackage((previous) => (hasUsageChanged(previous, nextUsage) ? nextUsage : previous));
  }, [selectedPackages]);

  useFocusEffect(
    useCallback(() => {
      refreshUsage();
    }, [refreshUsage]),
  );

  useAppStateOnActive(refreshUsage);

  const getLimits = appLimitsStore((state) => state.getLimits);

  const appRows = useMemo(() => {
    return buildDashboardAppRows(selectedApps, limitsByPackage, usageByPackage, getLimits);
  }, [getLimits, limitsByPackage, selectedApps, usageByPackage]);

  return { appRows, refreshUsage };
};
