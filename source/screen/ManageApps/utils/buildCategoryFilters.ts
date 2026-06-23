/** @format */

import type { TranslateFn } from '@/i18n';

import type { CategoryFilterOption, ManageApp } from '../types';

export const createAllCategoryFilter = (t: TranslateFn): CategoryFilterOption => ({
  id: 'all',
  label: t('common.all'),
  category: 'all',
});

export const buildCategoryFilters = (apps: ManageApp[], t: TranslateFn): CategoryFilterOption[] => {
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

  return [createAllCategoryFilter(t), ...categoryFilters];
};
