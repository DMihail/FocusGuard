import React, { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { FlashList } from '@shopify/flash-list';

import { MANAGE_APPS_FLASH_LIST_PROPS } from '@/list';
import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';

import { createManageAppListRenderItem, manageAppKeyExtractor, ManageAppsListEmpty } from '../list';
import { manageAppsStyles } from '../styles';
import type { ManageAppsContentProps } from '../types';
import { ManageAppsListHeader } from './ManageAppsListHeader';

export function ManageAppsContent({
  apps,
  isLoadingApps,
  isFiltering,
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

  const listHeader = useMemo(
    () => (
      <ManageAppsListHeader
        selectedApps={selectedApps}
        onSelectedAppPress={onSelectedAppPress}
        onSelectedAppRemove={onSelectedAppRemove}
        isSearchActive={isSearchActive}
        categoryFilters={categoryFilters}
        activeCategoryId={activeCategoryId}
        onCategoryChange={onCategoryChange}
      />
    ),
    [
      activeCategoryId,
      categoryFilters,
      isSearchActive,
      onCategoryChange,
      onSelectedAppPress,
      onSelectedAppRemove,
      selectedApps,
    ],
  );

  const listEmpty = useMemo(() => <ManageAppsListEmpty isFiltering={isFiltering} />, [isFiltering]);

  return (
    <View style={manageAppsStyles.content} testID={testIds.manageApps.appsList}>
      <View
        style={[manageAppsStyles.listWrapper, (isFiltering || isLoadingApps) && manageAppsStyles.contentDimmed]}
        accessibilityState={isFiltering || isLoadingApps ? { busy: true } : undefined}
      >
        {isFiltering || isLoadingApps ? (
          <View style={manageAppsStyles.filterLoader} pointerEvents="none">
            <ActivityIndicator
              size="small"
              color={colors.accent}
              accessibilityLabel={isLoadingApps ? 'Loading apps' : 'Filtering apps'}
              testID={isLoadingApps ? testIds.manageApps.appsLoader : testIds.manageApps.appsFilterLoader}
            />
          </View>
        ) : null}

        <FlashList
          style={manageAppsStyles.flatList}
          testID={testIds.manageApps.scroll}
          data={apps}
          renderItem={renderItem}
          keyExtractor={manageAppKeyExtractor}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={listEmpty}
          contentContainerStyle={manageAppsStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="none"
          accessibilityRole="list"
          accessibilityLabel="Installed apps"
          {...MANAGE_APPS_FLASH_LIST_PROPS}
        />
      </View>
    </View>
  );
}
