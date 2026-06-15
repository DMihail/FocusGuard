import type { CategoryFilterOption } from '../types';
import { ALL_CATEGORY_FILTER } from '../utils/buildCategoryFilters';

export const inactiveManageAppsFilters = {
  isFiltering: false,
  isSearchActive: false,
  setSearchQuery: () => undefined,
  setSearchInputActive: () => undefined,
  categoryFilters: [ALL_CATEGORY_FILTER] as CategoryFilterOption[],
  activeCategoryId: ALL_CATEGORY_FILTER.id,
  setActiveCategory: () => undefined,
};
