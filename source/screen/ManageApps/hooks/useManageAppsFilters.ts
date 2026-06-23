/** @format */

import { useCallback, useMemo, useState, useTransition } from 'react';

import type { ManageApp } from '@/domain/types';
import { useTranslation } from '@/i18n';
import { configureSectionLayoutAnimation } from '@/utils/layoutAnimation';

import type { CategoryFilterOption } from '../types';
import { buildCategoryFilters, createAllCategoryFilter } from '../utils/buildCategoryFilters';
import { matchesCategoryFilter } from '../utils/matchesCategoryFilter';

type UseManageAppsFiltersParams = {
  installedApps: ManageApp[];
};

/** Search and category filtering for the Manage Apps list. */
export const useManageAppsFilters = ({ installedApps }: UseManageAppsFiltersParams) => {
  const { t } = useTranslation();
  const allCategoryFilter = useMemo(() => createAllCategoryFilter(t), [t]);
  const categoryFilters = useMemo(() => buildCategoryFilters(installedApps, t), [installedApps, t]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchInputActive, setIsSearchInputActive] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryFilterOption | null>(null);
  const [isCategoryPending, startCategoryTransition] = useTransition();

  const effectiveCategory = useMemo(() => {
    const current = activeCategory ?? allCategoryFilter;

    if (categoryFilters.some((filter) => filter.id === current.id)) {
      return current;
    }

    return allCategoryFilter;
  }, [activeCategory, allCategoryFilter, categoryFilters]);

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

  const filteredApps = useMemo(() => {
    return installedApps.filter((app) => {
      if (normalizedSearchQuery.length > 0) {
        return (
          app.appName.toLowerCase().includes(normalizedSearchQuery) ||
          app.packageName.toLowerCase().includes(normalizedSearchQuery)
        );
      }

      return matchesCategoryFilter(app, effectiveCategory);
    });
  }, [effectiveCategory, installedApps, normalizedSearchQuery]);

  const handleCategoryChange = useCallback(
    (filterId: string) => {
      if (isSearchActive) {
        return;
      }

      const nextFilter = categoryFilters.find((filter) => filter.id === filterId);

      if (nextFilter && nextFilter.id !== effectiveCategory.id) {
        startCategoryTransition(() => {
          setActiveCategory(nextFilter);
        });
      }
    },
    [categoryFilters, effectiveCategory.id, isSearchActive],
  );

  return {
    apps: filteredApps,
    isFiltering,
    isSearchActive,
    setSearchQuery,
    setSearchInputActive: handleSearchActiveChange,
    categoryFilters,
    activeCategoryId: effectiveCategory.id,
    setActiveCategory: handleCategoryChange,
  };
};
