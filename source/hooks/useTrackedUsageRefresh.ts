/** @format */

import { useCallback, useMemo, useRef } from 'react';

import { useIsFocused } from '@react-navigation/native';

import { getManageAppKey } from '@/domain/appKey';
import { useCoreStoresHydrated } from '@/hooks/useCoreStoresHydrated';
import { selectedAppsStore, trackedUsageStore } from '@/store';

/** Shared refresh controls for screens that display tracked usage without mount lifecycle. */
export const useTrackedUsageRefresh = () => {
  const isFocused = useIsFocused();
  const hasCoreStoresHydrated = useCoreStoresHydrated();
  const selectedApps = selectedAppsStore((state) => state.apps);
  const selectedAppKeys = useMemo(() => selectedApps.map((app) => getManageAppKey(app)), [selectedApps]);
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

  return {
    refreshUsage,
    showUsageRefreshIndicator: isFocused && isRefreshingUsage,
  };
};
