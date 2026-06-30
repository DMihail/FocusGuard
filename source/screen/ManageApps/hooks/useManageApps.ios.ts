import { useMemo } from 'react';

import { useTranslation } from '@/i18n';

import { createAllCategoryFilter } from '../utils/buildCategoryFilters';
import { useInstalledAppsCatalog } from './useInstalledAppsCatalog';
import { useManageAppsSelection } from './useManageAppsSelection';

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
  const selection = useManageAppsSelection();

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
