/** @format */

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';

import type { ManageApp } from '@/domain/types';
import { configureSectionLayoutAnimation } from '@/utils/layoutAnimation';

import type { CategoryFilterOption } from '../types';
import { ALL_CATEGORY_FILTER, buildCategoryFilters } from '../utils/buildCategoryFilters';
import { matchesCategoryFilter } from '../utils/matchesCategoryFilter';

type UseManageAppsFiltersParams = {
  installedApps: ManageApp[];
};

/** Search and category filtering for the Manage Apps list. */
export const useManageAppsFilters = ({ installedApps }: UseManageAppsFiltersParams) => {
  const categoryFilters = useMemo(() => buildCategoryFilters(installedApps), [installedApps]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchInputActive, setIsSearchInputActive] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryFilterOption>(ALL_CATEGORY_FILTER);
  const [isCategoryPending, startCategoryTransition] = useTransition();

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
    isFiltering,
    isSearchActive,
    setSearchQuery,
    setSearchInputActive: handleSearchActiveChange,
    categoryFilters,
    activeCategoryId: activeCategory.id,
    setActiveCategory: handleCategoryChange,
  };
};
