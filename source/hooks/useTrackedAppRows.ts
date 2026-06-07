import { useCallback, useMemo } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import { getCachedUsageByPackage } from '@/domain/usageStatsCatalog';
import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
import { appLimitsStore, selectedAppsStore, trackedUsageStore } from '@/store';
import { buildDashboardAppRows, type DashboardAppRow } from '@/utils/usage/dashboardStats';

const seedTrackedUsageFromCache = (): void => {
  const cached = getCachedUsageByPackage();
  const packageNames = selectedAppsStore.getState().apps.map((app) => app.packageName);

  if (!cached || packageNames.length === 0) {
    return;
  }

  const picked: Record<string, number> = {};

  for (const packageName of packageNames) {
    const usageMs = cached[packageName];

    if (usageMs !== undefined) {
      picked[packageName] = usageMs;
    }
  }

  if (Object.keys(picked).length > 0) {
    trackedUsageStore.setState({ usageByPackage: picked });
  }
};

let hasSeededTrackedUsage = false;

export const resetTrackedUsageSeedForTests = (): void => {
  hasSeededTrackedUsage = false;
};

const ensureTrackedUsageSeeded = (): void => {
  if (hasSeededTrackedUsage) {
    return;
  }

  hasSeededTrackedUsage = true;
  seedTrackedUsageFromCache();
};

export const useTrackedAppRows = (): {
  appRows: DashboardAppRow[];
  refreshUsage: (force?: boolean) => Promise<void>;
} => {
  ensureTrackedUsageSeeded();

  const selectedApps = selectedAppsStore((state) => state.apps);
  const selectedPackages = useMemo(() => selectedApps.map((app) => app.packageName), [selectedApps]);
  const usageByPackage = trackedUsageStore((state) => state.usageByPackage);
  const refreshTrackedUsage = trackedUsageStore((state) => state.refreshUsage);
  const limitsByPackage = appLimitsStore(
    useShallow((state) =>
      Object.fromEntries(selectedPackages.map((packageName) => [packageName, state.limitsByPackage[packageName]])),
    ),
  );

  const refreshUsage = useCallback(
    (force = false) => refreshTrackedUsage(selectedPackages, force),
    [refreshTrackedUsage, selectedPackages],
  );

  useFocusEffect(
    useCallback(() => {
      refreshUsage().catch(() => undefined);
    }, [refreshUsage]),
  );

  useAppStateOnActive(refreshUsage);

  const getLimits = appLimitsStore((state) => state.getLimits);

  const appRows = useMemo(() => {
    return buildDashboardAppRows(selectedApps, limitsByPackage, usageByPackage, getLimits);
  }, [getLimits, limitsByPackage, selectedApps, usageByPackage]);

  return { appRows, refreshUsage };
};
