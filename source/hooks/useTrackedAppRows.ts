/** @format */

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useIsFocused } from '@react-navigation/native';

import { useSelectedDashboardAppRows } from '@/context/SelectedDashboardAppRowsProvider';
import { getManageAppKey } from '@/domain/appKey';
import { useCoreStoresHydrated } from '@/hooks/useCoreStoresHydrated';
import { useLocalDayChangeRefresh } from '@/hooks/useLocalDayChangeRefresh';
import { useRefreshWhenVisible } from '@/hooks/useRefreshWhenVisible';
import { trackedUsageStore } from '@/store';
import { logDevWarning } from '@/utils/logDevWarning';

export type UseTrackedAppRowsOptions = {
  /** When false, skips mount refresh for stacked screens that share a primary instance. */
  lifecycle?: boolean;
};

export const useTrackedAppRows = (
  options?: UseTrackedAppRowsOptions,
): {
  appRows: ReturnType<typeof useSelectedDashboardAppRows>;
  showUsageRefreshIndicator: boolean;
  refreshUsage: (force?: boolean) => Promise<void>;
} => {
  const lifecycle = options?.lifecycle !== false;
  const isFocused = useIsFocused();
  const hasCoreStoresHydrated = useCoreStoresHydrated();
  const appRows = useSelectedDashboardAppRows();
  const selectedAppKeys = useMemo(() => appRows.map((row) => getManageAppKey(row)), [appRows]);
  const selectedAppKeysKey = selectedAppKeys.join('\0');
  const isRefreshingUsage = trackedUsageStore((state) => state.isRefreshingUsage);

  const selectedAppKeysRef = useRef(selectedAppKeys);
  selectedAppKeysRef.current = selectedAppKeys;
  const lastLifecycleRefreshKeysKeyRef = useRef<string | null>(null);

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
    if (!lifecycle || !hasCoreStoresHydrated) {
      return;
    }

    trackedUsageStore.getState().seedUsageFromCache();

    if (selectedAppKeys.length === 0) {
      return;
    }

    if (lastLifecycleRefreshKeysKeyRef.current === selectedAppKeysKey) {
      return;
    }

    lastLifecycleRefreshKeysKeyRef.current = selectedAppKeysKey;
    refreshUsage(false).catch(logDevWarning);
  }, [hasCoreStoresHydrated, lifecycle, refreshUsage, selectedAppKeys.length, selectedAppKeysKey]);

  const refreshUsageSoft = useCallback(() => refreshUsage(false), [refreshUsage]);
  const refreshUsageHard = useCallback(() => refreshUsage(true), [refreshUsage]);

  useRefreshWhenVisible(refreshUsageSoft);
  useLocalDayChangeRefresh(refreshUsageHard);

  return {
    appRows,
    showUsageRefreshIndicator: isFocused && isRefreshingUsage,
    refreshUsage,
  };
};
