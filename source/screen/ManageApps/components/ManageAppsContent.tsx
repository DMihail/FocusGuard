/** @format */

import React, { memo, useCallback, useMemo, useRef } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { APP_LIST_FLAT_LIST_PROPS } from '@/list';
import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';

import { createManageAppListRenderItem, manageAppKeyExtractor, ManageAppsListEmpty } from '../list';
import { manageAppsStyles } from '../styles';
import type { ManageAppsContentProps, ManageAppsListHeaderProps } from '../types';
import { ManageAppsListHeader } from './ManageAppsListHeader';

function ManageAppsContentView({
  apps,
  isFiltering,
  selectedCount,
  selectedApps,
  isSelected,
  onToggle,
  onSelectedAppPress,
  onSelectedAppRemove,
  isSearchActive,
  categoryFilters,
  activeCategoryId,
  onCategoryChange,
}: ManageAppsContentProps) {
  const renderItem = useMemo(() => createManageAppListRenderItem(isSelected, onToggle), [isSelected, onToggle]);
  const listEmptyComponent = useMemo(() => <ManageAppsListEmpty isFiltering={isFiltering} />, [isFiltering]);

  const listHeaderPropsRef = useRef<ManageAppsListHeaderProps>({
    selectedApps,
    onSelectedAppPress,
    onSelectedAppRemove,
    isSearchActive,
    categoryFilters,
    activeCategoryId,
    onCategoryChange,
  });

  listHeaderPropsRef.current = {
    selectedApps,
    onSelectedAppPress,
    onSelectedAppRemove,
    isSearchActive,
    categoryFilters,
    activeCategoryId,
    onCategoryChange,
  };

  const renderListHeader = useCallback(() => <ManageAppsListHeader {...listHeaderPropsRef.current} />, []);

  return (
    <View style={manageAppsStyles.content} testID={testIds.manageApps.appsList}>
      <View
        style={[manageAppsStyles.listWrapper, isFiltering && manageAppsStyles.contentDimmed]}
        accessibilityState={isFiltering ? { busy: true } : undefined}
      >
        {isFiltering ? (
          <View style={manageAppsStyles.filterLoader} pointerEvents="none">
            <ActivityIndicator
              size="small"
              color={colors.accent}
              accessibilityLabel="Filtering apps"
              testID={testIds.manageApps.appsFilterLoader}
            />
          </View>
        ) : null}

        <FlatList
          style={manageAppsStyles.flatList}
          testID={testIds.manageApps.scroll}
          data={apps}
          renderItem={renderItem}
          keyExtractor={manageAppKeyExtractor}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={listEmptyComponent}
          contentContainerStyle={manageAppsStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="none"
          accessibilityRole="list"
          accessibilityLabel="Installed apps"
          extraData={selectedCount}
          {...APP_LIST_FLAT_LIST_PROPS}
          removeClippedSubviews={false}
        />
      </View>
    </View>
  );
}

export const ManageAppsContent = memo(ManageAppsContentView);
