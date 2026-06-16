/** @format */

import React, { Activity } from 'react';
import { View } from 'react-native';

import { manageAppsStyles } from '../styles';
import type { ManageAppsListHeaderProps } from '../types';
import { CategoryFilters } from './CategoryFilters';
import { SelectedAppsSection } from './SelectedAppsSection';

export const ManageAppsListHeader = ({
  selectedApps,
  onSelectedAppPress,
  onSelectedAppRemove,
  isSearchActive,
  categoryFilters,
  activeCategoryId,
  onCategoryChange,
  showCategoryFilters = true,
}: ManageAppsListHeaderProps) => (
  <View style={manageAppsStyles.listHeader}>
    <SelectedAppsSection apps={selectedApps} onAppPress={onSelectedAppPress} onAppRemove={onSelectedAppRemove} />

    {showCategoryFilters ? (
      <Activity mode={isSearchActive ? 'hidden' : 'visible'}>
        <CategoryFilters
          filters={categoryFilters}
          activeCategoryId={activeCategoryId}
          onCategoryChange={onCategoryChange}
        />
      </Activity>
    ) : null}
  </View>
);
