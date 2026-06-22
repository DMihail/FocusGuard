import { useShallow } from 'zustand/react/shallow';

import { selectedAppsStore } from '@/store';

import { ALL_CATEGORY_FILTER } from '../utils/buildCategoryFilters';
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
    isFiltering: false,
    isSearchActive: false,
    setSearchQuery: () => undefined,
    setSearchInputActive: () => undefined,
    categoryFilters: [ALL_CATEGORY_FILTER],
    activeCategoryId: ALL_CATEGORY_FILTER.id,
    setActiveCategory: () => undefined,
    ...selection,
  };
};
