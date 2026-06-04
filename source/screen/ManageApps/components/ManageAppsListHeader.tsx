/** @format */

import React, { memo } from 'react';

import type { CategoryFilterOption, ManageApp } from '../types';
import { CategoryFilters } from './CategoryFilters';
import { SelectedAppsSection } from './SelectedAppsSection';

export type ManageAppsListHeaderProps = {
  isSearchActive: boolean;
  categoryFilters: CategoryFilterOption[];
  activeCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
  selectedApps: ManageApp[];
  onSelectedAppPress: (packageName: string) => void;
};

function ManageAppsListHeaderView({
  isSearchActive,
  categoryFilters,
  activeCategoryId,
  onCategoryChange,
  selectedApps,
  onSelectedAppPress,
}: ManageAppsListHeaderProps) {
  return (
    <>
      {!isSearchActive ? (
        <CategoryFilters
          filters={categoryFilters}
          activeCategoryId={activeCategoryId}
          onCategoryChange={onCategoryChange}
        />
      ) : null}

      <SelectedAppsSection apps={selectedApps} onAppPress={onSelectedAppPress} />
    </>
  );
}

export const ManageAppsListHeader = memo(ManageAppsListHeaderView);
