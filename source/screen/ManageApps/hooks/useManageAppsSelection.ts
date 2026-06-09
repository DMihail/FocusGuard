/** @format */

import { useShallow } from 'zustand/react/shallow';

import { selectedAppsStore } from '@/store';

/** Selected-app state and toggle handlers for Manage Apps. */
export const useManageAppsSelection = () => {
  const { selectedApps, toggleAppSelection, isSelected } = selectedAppsStore(
    useShallow((state) => ({
      selectedApps: state.apps,
      toggleAppSelection: state.toggleApp,
      isSelected: state.isSelected,
    })),
  );

  return {
    selectedApps,
    isSelected,
    toggleAppSelection,
    selectedCount: selectedApps.length,
  };
};
