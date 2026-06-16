import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useIsFocused } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import { getManageAppKey } from '@/domain/appKey';
import { useRefreshWhenVisible } from '@/hooks/useRefreshWhenVisible';
import { useSelectedAppsHydrated } from '@/hooks/useSelectedAppsHydrated';
import { appLimitsStore, selectedAppsStore, trackedUsageStore } from '@/store';
import { logDevWarning } from '@/utils/logDevWarning';
import { buildDashboardAppRows, type DashboardAppRow } from '@/utils/usage/dashboardStats';

export const useTrackedAppRows = (): {
  appRows: DashboardAppRow[];
  showUsageRefreshIndicator: boolean;
  refreshUsage: (force?: boolean) => Promise<void>;
} => {
  const isFocused = useIsFocused();
  const hasSelectedAppsHydrated = useSelectedAppsHydrated();
  const hasSyncedInitialKeysRef = useRef(false);

  useEffect(() => {
    if (!hasSelectedAppsHydrated) {
      return;
    }

    trackedUsageStore.getState().seedUsageFromCache();
  }, [hasSelectedAppsHydrated]);

  const selectedApps = selectedAppsStore((state) => state.apps);
  const selectedAppKeys = useMemo(() => selectedApps.map((app) => getManageAppKey(app)), [selectedApps]);
  const selectedAppKeysKey = selectedAppKeys.join('\0');
  const { usageByPackage, isRefreshingUsage } = trackedUsageStore(
    useShallow((state) => ({
      usageByPackage: state.usageByPackage,
      isRefreshingUsage: state.isRefreshingUsage,
    })),
  );
  const limitsByAppKey = appLimitsStore(
    useShallow((state) => Object.fromEntries(selectedAppKeys.map((appKey) => [appKey, state.limitsByAppKey[appKey]]))),
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
    if (!hasSelectedAppsHydrated || selectedAppKeys.length === 0) {
      return;
    }

    if (!hasSyncedInitialKeysRef.current) {
      hasSyncedInitialKeysRef.current = true;
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
