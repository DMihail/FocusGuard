/** @format */

import type { CategoryFilterOption, ManageApp } from '../types';

export const ALL_CATEGORY_FILTER: CategoryFilterOption = {
  id: 'all',
  label: 'All',
  category: 'all',
};

export const buildCategoryFilters = (apps: ManageApp[]): CategoryFilterOption[] => {
  const categoriesByLabel = new Map<string, string>();

  for (const app of apps) {
    if (!categoriesByLabel.has(app.categoryLabel)) {
      categoriesByLabel.set(app.categoryLabel, app.category);
    }
  }

  const categoryFilters = Array.from(categoriesByLabel.entries())
    .sort(([labelA], [labelB]) => labelA.localeCompare(labelB))
    .map(([label, category]) => ({
      id: label,
      label,
      category,
    }));

  return [ALL_CATEGORY_FILTER, ...categoryFilters];
};
