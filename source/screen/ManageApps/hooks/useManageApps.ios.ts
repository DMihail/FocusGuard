/** @format */

import { useCallback } from 'react';

import { ALL_CATEGORY_FILTER } from '../utils/buildCategoryFilters';
import { useInstalledAppsCatalog } from './useInstalledAppsCatalog.ios';
import { useManageAppsSelection } from './useManageAppsSelection';

const noop = (): void => undefined;

/** Composes picker selection refresh and tracked-app state for Manage Apps on iOS. */
export const useManageApps = () => {
  const { installedApps, isLoadingApps, refreshInstalledApps } = useInstalledAppsCatalog();
  const selection = useManageAppsSelection();

  const setSearchQuery = useCallback(noop, []);
  const setSearchInputActive = useCallback(noop, []);
  const setActiveCategory = useCallback(noop, []);

  return {
    apps: installedApps,
    isLoadingApps,
    refreshInstalledApps,
    isFiltering: false,
    isSearchActive: false,
    setSearchQuery,
    setSearchInputActive,
    categoryFilters: [ALL_CATEGORY_FILTER],
    activeCategoryId: ALL_CATEGORY_FILTER.id,
    setActiveCategory,
    ...selection,
  };
};
