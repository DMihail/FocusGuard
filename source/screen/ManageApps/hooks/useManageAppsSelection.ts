/** @format */

import { useCallback } from 'react';

import { useShallow } from 'zustand/react/shallow';

import type { ManageApp } from '@/domain/types';
import { selectedAppsStore } from '@/store';
import { configureSectionLayoutAnimation } from '@/utils/layoutAnimation';

/** Selected-app state and toggle handlers for Manage Apps. */
export const useManageAppsSelection = () => {
  const { selectedApps, toggleAppSelection, isSelected } = selectedAppsStore(
    useShallow((state) => ({
      selectedApps: state.apps,
      toggleAppSelection: state.toggleApp,
      isSelected: state.isSelected,
    })),
  );

  const handleToggleAppSelection = useCallback(
    (app: ManageApp) => {
      configureSectionLayoutAnimation();
      toggleAppSelection(app);
    },
    [toggleAppSelection],
  );

  return {
    selectedApps,
    isSelected,
    toggleAppSelection: handleToggleAppSelection,
    selectedCount: selectedApps.length,
  };
};
