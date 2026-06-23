import React, { Activity, memo } from 'react';
import { View } from 'react-native';

import { useManageAppsStyles } from '../styles';
import type { ManageAppsListHeaderProps } from '../types';
import { areManageAppListsEqual } from '../utils/areManageAppListsEqual';
import { CategoryFilters } from './CategoryFilters';
import { SelectedAppsSection } from './SelectedAppsSection';

const areManageAppsListHeaderPropsEqual = (
  previous: ManageAppsListHeaderProps,
  next: ManageAppsListHeaderProps,
): boolean =>
  previous.isSearchActive === next.isSearchActive &&
  previous.activeCategoryId === next.activeCategoryId &&
  previous.showCategoryFilters === next.showCategoryFilters &&
  previous.onSelectedAppPress === next.onSelectedAppPress &&
  previous.onSelectedAppRemove === next.onSelectedAppRemove &&
  previous.onCategoryChange === next.onCategoryChange &&
  areManageAppListsEqual(previous.selectedApps, next.selectedApps) &&
  previous.categoryFilters === next.categoryFilters;

export const ManageAppsListHeader = memo(
  ({
    selectedApps,
    onSelectedAppPress,
    onSelectedAppRemove,
    isSearchActive,
    categoryFilters,
    activeCategoryId,
    onCategoryChange,
    showCategoryFilters = true,
  }: ManageAppsListHeaderProps) => {
    const styles = useManageAppsStyles();

    return (
      <View style={styles.listHeader}>
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
  },
  areManageAppsListHeaderPropsEqual,
);
