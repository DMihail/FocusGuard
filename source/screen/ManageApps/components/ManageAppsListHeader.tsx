/** @format */

import React, { memo } from 'react';

import type { CategoryFilterOption, ManageApp } from '../types';
import { AppSearchField } from './AppSearchField';
import { CategoryFilters } from './CategoryFilters';
import { SelectedAppsSection } from './SelectedAppsSection';

type ManageAppsListHeaderProps = {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  isSearchActive: boolean;
  categoryFilters: CategoryFilterOption[];
  activeCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
  selectedApps: ManageApp[];
  onSelectedAppPress: (packageName: string) => void;
};

function ManageAppsListHeaderView({
  searchQuery,
  onSearchChange,
  isSearchActive,
  categoryFilters,
  activeCategoryId,
  onCategoryChange,
  selectedApps,
  onSelectedAppPress,
}: ManageAppsListHeaderProps) {
  return (
    <>
      <AppSearchField value={searchQuery} onChangeText={onSearchChange} />

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
