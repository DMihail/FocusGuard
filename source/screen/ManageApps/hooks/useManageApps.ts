/** @format */

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';

import { useShallow } from 'zustand/react/shallow';

import { getCachedInstalledApps, invalidateInstalledAppsCache, loadInstalledApps } from '@/domain/installedAppsCatalog';
import { selectedAppsStore } from '@/store';
import { configureSectionLayoutAnimation } from '@/utils/layoutAnimation';

import type { CategoryFilterOption, ManageApp } from '../types';
import { ALL_CATEGORY_FILTER, buildCategoryFilters } from '../utils/buildCategoryFilters';
import { matchesCategoryFilter } from '../utils/matchesCategoryFilter';

export const useManageApps = () => {
  const [installedApps, setInstalledApps] = useState<ManageApp[]>(() => getCachedInstalledApps() ?? []);
  const [isLoadingApps, setIsLoadingApps] = useState(() => getCachedInstalledApps() === null);

  const refreshInstalledApps = useCallback(async (force = false) => {
    if (force) {
      invalidateInstalledAppsCache();
    }

    const hasCachedApps = getCachedInstalledApps() !== null;

    if (!hasCachedApps) {
      setIsLoadingApps(true);
    }

    const apps = await loadInstalledApps(force);
    selectedAppsStore.getState().syncSelectedAppsMetadata(apps);
    setInstalledApps(apps);
    setIsLoadingApps(false);
  }, []);

  const categoryFilters = useMemo(() => buildCategoryFilters(installedApps), [installedApps]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchInputActive, setIsSearchInputActive] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryFilterOption>(ALL_CATEGORY_FILTER);
  const [isCategoryPending, startCategoryTransition] = useTransition();
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

  const handleSearchActiveChange = useCallback((isActive: boolean) => {
    setIsSearchInputActive((previous) => {
      if (previous !== isActive) {
        configureSectionLayoutAnimation();
      }

      return isActive;
    });
  }, []);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const isSearchActive = isSearchInputActive || normalizedSearchQuery.length > 0;
  const isFiltering = !isSearchActive && isCategoryPending;

  useEffect(() => {
    const isActiveFilterAvailable = categoryFilters.some((filter) => filter.id === activeCategory.id);

    if (!isActiveFilterAvailable) {
      setActiveCategory(ALL_CATEGORY_FILTER);
    }
  }, [activeCategory.id, categoryFilters]);

  const filteredApps = useMemo(() => {
    return installedApps.filter((app) => {
      if (normalizedSearchQuery.length > 0) {
        return (
          app.appName.toLowerCase().includes(normalizedSearchQuery) ||
          app.packageName.toLowerCase().includes(normalizedSearchQuery)
        );
      }

      return matchesCategoryFilter(app, activeCategory);
    });
  }, [activeCategory, installedApps, normalizedSearchQuery]);

  const handleCategoryChange = useCallback(
    (filterId: string) => {
      if (isSearchActive) {
        return;
      }

      const nextFilter = categoryFilters.find((filter) => filter.id === filterId);

      if (nextFilter && nextFilter.id !== activeCategory.id) {
        startCategoryTransition(() => {
          setActiveCategory(nextFilter);
        });
      }
    },
    [activeCategory.id, categoryFilters, isSearchActive],
  );

  return {
    apps: filteredApps,
    isLoadingApps,
    refreshInstalledApps,
    isFiltering,
    isSearchActive,
    selectedApps,
    setSearchQuery,
    setSearchInputActive: handleSearchActiveChange,
    categoryFilters,
    activeCategoryId: activeCategory.id,
    setActiveCategory: handleCategoryChange,
    isSelected,
    toggleAppSelection: handleToggleAppSelection,
    selectedCount: selectedApps.length,
  };
};
