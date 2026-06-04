/** @format */

import { useCallback, useDeferredValue, useEffect, useMemo, useState, useTransition } from 'react';

import { getInstalledApplications } from '@/specs';
import { selectedAppsStore } from '@/store';
import { configureSectionLayoutAnimation } from '@/utils/layoutAnimation';

import type { CategoryFilterOption, ManageApp } from '../types';
import { ALL_CATEGORY_FILTER, buildCategoryFilters } from '../utils/buildCategoryFilters';
import { mapInstalledApps } from '../utils/mapInstalledApps';
import { matchesCategoryFilter } from '../utils/matchesCategoryFilter';

export const useManageApps = () => {
  const [installedApps, setInstalledApps] = useState(() => mapInstalledApps(getInstalledApplications()));

  const refreshInstalledApps = useCallback(() => {
    setInstalledApps(mapInstalledApps(getInstalledApplications()));
  }, []);

  const apps = installedApps;
  const categoryFilters = useMemo(() => buildCategoryFilters(apps), [apps]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilterOption>(ALL_CATEGORY_FILTER);
  const [isCategoryPending, startCategoryTransition] = useTransition();
  const selectedApps = selectedAppsStore((state) => state.apps);
  const toggleAppInStore = selectedAppsStore((state) => state.toggleApp);
  const isSelected = selectedAppsStore((state) => state.isSelected);
  const selectedCount = useMemo(() => selectedApps.length, [selectedApps]);

  const toggleAppSelection = useCallback(
    (app: ManageApp) => {
      configureSectionLayoutAnimation();
      toggleAppInStore(app);
    },
    [toggleAppInStore],
  );

  const handleSearchQueryChange = useCallback((text: string) => {
    setSearchQuery((previous) => {
      const wasSearchActive = previous.trim().length > 0;
      const willBeSearchActive = text.trim().length > 0;

      if (wasSearchActive !== willBeSearchActive) {
        configureSectionLayoutAnimation();
      }

      return text;
    });
  }, []);

  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const normalizedDeferredQuery = deferredSearchQuery.trim().toLowerCase();
  const isSearchActive = normalizedSearchQuery.length > 0;
  const isSearchPending = searchQuery !== deferredSearchQuery;
  const isFiltering = isSearchPending || (!isSearchActive && isCategoryPending);

  useEffect(() => {
    const isActiveFilterAvailable = categoryFilters.some((filter) => filter.id === activeCategory.id);

    if (!isActiveFilterAvailable) {
      setActiveCategory(ALL_CATEGORY_FILTER);
    }
  }, [activeCategory.id, categoryFilters]);

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      if (normalizedDeferredQuery.length > 0) {
        return (
          app.appName.toLowerCase().includes(normalizedDeferredQuery) ||
          app.packageName.toLowerCase().includes(normalizedDeferredQuery)
        );
      }

      return matchesCategoryFilter(app, activeCategory);
    });
  }, [activeCategory, apps, normalizedDeferredQuery]);

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
    refreshInstalledApps,
    isFiltering,
    isSearchActive,
    selectedApps,
    selectedCount,
    searchQuery,
    setSearchQuery: handleSearchQueryChange,
    categoryFilters,
    activeCategory,
    setActiveCategory: handleCategoryChange,
    isSelected,
    toggleAppSelection,
  };
};
