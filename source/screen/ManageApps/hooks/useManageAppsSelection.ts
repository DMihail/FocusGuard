/** @format */

import { useShallow } from 'zustand/react/shallow';

import { getManageAppKey } from '@/domain/appKey';
import { selectedAppsStore } from '@/store';

/** O(1) selection checks for large installed-app lists. */
export const useManageAppsSelection = () =>
  selectedAppsStore(
    useShallow((state) => {
      const selectedKeySet = new Set(state.apps.map((app) => getManageAppKey(app)));

      return {
        selectedApps: state.apps,
        toggleAppSelection: state.toggleApp,
        isSelected: (appKey: string) => selectedKeySet.has(appKey),
        selectedCount: state.apps.length,
      };
    }),
  );
