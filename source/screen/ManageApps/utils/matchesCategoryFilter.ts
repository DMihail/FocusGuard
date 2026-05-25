/** @format */

import type { CategoryFilterOption, ManageApp } from '../types';

export const matchesCategoryFilter = (app: ManageApp, filter: CategoryFilterOption): boolean => {
  if (filter.id === 'all') {
    return true;
  }

  return app.categoryLabel === filter.label && app.category === filter.category;
};
