import { useShallow } from 'zustand/react/shallow';

import { selectedAppsStore } from '@/store';

import { useInstalledAppsCatalog } from './useInstalledAppsCatalog';
import { useManageAppsFilters } from './useManageAppsFilters';

export const useManageApps = () => {
  const { installedApps, isLoadingApps, refreshInstalledApps } = useInstalledAppsCatalog();
  const filters = useManageAppsFilters({ installedApps });
  const selection = selectedAppsStore(
    useShallow((state) => ({
      selectedApps: state.apps,
      toggleAppSelection: state.toggleApp,
      isSelected: state.isSelected,
      selectedCount: state.apps.length,
    })),
  );

  return {
    ...filters,
    isLoadingApps,
    refreshInstalledApps,
    ...selection,
  };
};
