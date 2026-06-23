import { useMemo } from 'react';

import { useShallow } from 'zustand/react/shallow';

import { useTranslation } from '@/i18n';
import { selectedAppsStore } from '@/store';

import { createAllCategoryFilter } from '../utils/buildCategoryFilters';
import { useInstalledAppsCatalog } from './useInstalledAppsCatalog';

const noop = (): undefined => undefined;

const IOS_SEARCH_STUBS = {
  setSearchQuery: noop,
  setSearchInputActive: noop,
  setActiveCategory: noop,
} as const;

export const useManageApps = () => {
  const { t } = useTranslation();
  const allCategoryFilter = useMemo(() => createAllCategoryFilter(t), [t]);
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
    ...IOS_SEARCH_STUBS,
    categoryFilters: [allCategoryFilter],
    activeCategoryId: allCategoryFilter.id,
    ...selection,
  };
};
