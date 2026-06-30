/** @format */

import { useCallback, useMemo } from 'react';

import { useShallow } from 'zustand/react/shallow';

import { getManageAppKey } from '@/domain/appKey';
import { selectedAppsStore } from '@/store';

const buildSelectedKeysKey = (apps: ReturnType<typeof selectedAppsStore.getState>['apps']): string =>
  apps
    .map((app) => getManageAppKey(app))
    .sort()
    .join('\0');

/** O(1) selection checks for large installed-app lists. */
export const useManageAppsSelection = () => {
  const { selectedApps, toggleAppSelection, selectedKeysKey, selectedCount } = selectedAppsStore(
    useShallow((state) => ({
      selectedApps: state.apps,
      toggleAppSelection: state.toggleApp,
      selectedKeysKey: buildSelectedKeysKey(state.apps),
      selectedCount: state.apps.length,
    })),
  );

  const selectedKeySet = useMemo(() => new Set(selectedKeysKey ? selectedKeysKey.split('\0') : []), [selectedKeysKey]);

  const isSelected = useCallback((appKey: string) => selectedKeySet.has(appKey), [selectedKeySet]);

  return {
    selectedApps,
    toggleAppSelection,
    isSelected,
    selectedCount,
  };
};
