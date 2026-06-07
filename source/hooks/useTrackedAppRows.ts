/** @format */

import { useCallback, useMemo, useState, useTransition } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import { invalidateInstalledAppsCache, loadInstalledApps } from '@/domain/installedAppsCatalog';
import { invalidateUsageStatsCache, loadUsageByPackage } from '@/domain/usageStatsCatalog';
import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
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
  refreshUsage: (force?: boolean) => Promise<void>;
} => {
  const selectedApps = selectedAppsStore((state) => state.apps);
  const selectedPackages = useMemo(() => selectedApps.map((app) => app.packageName), [selectedApps]);
  const limitsByPackage = appLimitsStore(
    useShallow((state) =>
      Object.fromEntries(selectedPackages.map((packageName) => [packageName, state.limitsByPackage[packageName]])),
    ),
  );
  const [usageByPackage, setUsageByPackage] = useState<Record<string, number>>({});
  const [, startUsageTransition] = useTransition();

  const refreshUsage = useCallback(
    async (force = false) => {
      if (selectedPackages.length === 0) {
        startUsageTransition(() => {
          setUsageByPackage((previous) => (Object.keys(previous).length === 0 ? previous : {}));
        });
        return;
      }

      if (force) {
        invalidateUsageStatsCache();
        invalidateInstalledAppsCache();
      }

      const [installedApps, nextUsage] = await Promise.all([
        loadInstalledApps(force),
        loadUsageByPackage(selectedPackages, force),
      ]);

      selectedAppsStore.getState().syncSelectedAppsMetadata(installedApps);

      startUsageTransition(() => {
        setUsageByPackage((previous) => (hasUsageChanged(previous, nextUsage) ? nextUsage : previous));
      });
    },
    [selectedPackages],
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
