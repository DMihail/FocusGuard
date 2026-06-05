/** @format */

import React, { memo } from 'react';
import { View } from 'react-native';

import { manageAppsStyles } from '../styles';
import type { ManageAppsListHeaderProps } from '../types';
import { CategoryFilters } from './CategoryFilters';
import { SelectedAppsSection } from './SelectedAppsSection';

function ManageAppsListHeaderView({
  selectedApps,
  onSelectedAppPress,
  onSelectedAppRemove,
  isSearchActive,
  categoryFilters,
  activeCategoryId,
  onCategoryChange,
}: ManageAppsListHeaderProps) {
  return (
    <View style={manageAppsStyles.listHeader}>
      <SelectedAppsSection apps={selectedApps} onAppPress={onSelectedAppPress} onAppRemove={onSelectedAppRemove} />

      {!isSearchActive ? (
        <CategoryFilters
          filters={categoryFilters}
          activeCategoryId={activeCategoryId}
          onCategoryChange={onCategoryChange}
        />
      ) : null}
    </View>
  );
}

export const ManageAppsListHeader = memo(ManageAppsListHeaderView);
