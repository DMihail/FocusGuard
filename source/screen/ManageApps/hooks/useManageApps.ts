/** @format */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { selectedAppsStore } from '@/store';
import { getInstalledApplications } from '@/specs';
import type { CategoryFilterOption } from '../types';
import { ALL_CATEGORY_FILTER, buildCategoryFilters } from '../utils/buildCategoryFilters';
import { mapInstalledApps } from '../utils/mapInstalledApps';
import { matchesCategoryFilter } from '../utils/matchesCategoryFilter';

export const useManageApps = () => {
  const apps = useMemo(() => mapInstalledApps(getInstalledApplications()), []);
  const categoryFilters = useMemo(() => buildCategoryFilters(apps), [apps]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilterOption>(ALL_CATEGORY_FILTER);
  const selectedApps = selectedAppsStore((state) => state.apps);
  const toggleAppSelection = selectedAppsStore((state) => state.toggleApp);
  const isSelected = selectedAppsStore((state) => state.isSelected);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  useEffect(() => {
    const isActiveFilterAvailable = categoryFilters.some((filter) => filter.id === activeCategory.id);

    if (!isActiveFilterAvailable) {
      setActiveCategory(ALL_CATEGORY_FILTER);
    }
  }, [activeCategory.id, categoryFilters]);

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesCategory = matchesCategoryFilter(app, activeCategory);
      const matchesSearch =
        normalizedQuery.length === 0 ||
        app.appName.toLowerCase().includes(normalizedQuery) ||
        app.packageName.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, apps, normalizedQuery]);

  const handleCategoryChange = useCallback(
    (filterId: string) => {
      const nextFilter = categoryFilters.find((filter) => filter.id === filterId);

      if (nextFilter) {
        setActiveCategory(nextFilter);
      }
    },
    [categoryFilters],
  );

  return {
    apps: filteredApps,
    selectedApps,
    selectedCount: selectedApps.length,
    searchQuery,
    setSearchQuery,
    categoryFilters,
    activeCategory,
    setActiveCategory: handleCategoryChange,
    isSelected,
    toggleAppSelection,
  };
};
