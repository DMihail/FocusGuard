import { useShallow } from 'zustand/react/shallow';

import { selectedAppsStore } from '@/store';

import { inactiveManageAppsFilters } from './inactiveManageAppsFilters';
import { useInstalledAppsCatalog } from './useInstalledAppsCatalog';

export const useManageApps = () => {
  const { installedApps, isLoadingApps, refreshInstalledApps } = useInstalledAppsCatalog();
  const selection = selectedAppsStore(
    useShallow((state) => ({
      selectedApps: state.apps,
      toggleAppSelection: state.toggleApp,
      isSelected: state.isSelected,
      selectedCount: state.apps.length,
    })),
  );

  return {
    apps: installedApps,
    isLoadingApps,
    refreshInstalledApps,
    ...inactiveManageAppsFilters,
    ...selection,
  };
};
