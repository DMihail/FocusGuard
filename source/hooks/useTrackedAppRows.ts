/** @format */

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useIsFocused } from '@react-navigation/native';

import { useCoreStoresHydrated } from '@/context/CoreStoresHydrationProvider';
import { useSelectedDashboardAppRows } from '@/context/SelectedDashboardAppRowsProvider';
import { getManageAppKey } from '@/domain/appKey';
import { useLocalDayChangeRefresh } from '@/hooks/useLocalDayChangeRefresh';
import { useRefreshWhenVisible } from '@/hooks/useRefreshWhenVisible';
import { subscribeTrackedUsageChanged } from '@/specs';
import { trackedUsageStore } from '@/store';

export type UseTrackedAppRowsOptions = {
  /** When false, skips mount cache seed for stacked screens that share a primary instance. */
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
  const isRefreshingUsage = trackedUsageStore((state) => state.isRefreshingUsage);

  const selectedAppKeysRef = useRef(selectedAppKeys);
  selectedAppKeysRef.current = selectedAppKeys;

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
  }, [hasCoreStoresHydrated, lifecycle]);

  const refreshUsageSoft = useCallback(() => refreshUsage(false), [refreshUsage]);
  const refreshUsageHard = useCallback(() => refreshUsage(true), [refreshUsage]);

  useRefreshWhenVisible(refreshUsageSoft);
  useLocalDayChangeRefresh(refreshUsageHard);

  useEffect(() => {
    if (!hasCoreStoresHydrated) {
      return undefined;
    }

    const subscription = subscribeTrackedUsageChanged(() => {
      refreshUsageSoft().catch(() => undefined);
    });

    return () => {
      subscription.remove();
    };
  }, [hasCoreStoresHydrated, refreshUsageSoft]);

  return {
    appRows,
    showUsageRefreshIndicator: isFocused && isRefreshingUsage,
    refreshUsage,
  };
};
