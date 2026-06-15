import React, { Activity, useMemo } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { APP_LIST_FLAT_LIST_PROPS } from '@/list';
import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';

import { createManageAppListRenderItem, manageAppKeyExtractor, ManageAppsListEmpty } from '../list';
import { manageAppsStyles } from '../styles';
import type { ManageAppsContentProps } from '../types';
import { IosPickAppsButton } from './IosPickAppsButton';
import { ManageAppsListHeader } from './ManageAppsListHeader';

export const ManageAppsContent = ({
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
  showInstalledAppsList = true,
  onPickApps,
  isPickingApps = false,
}: ManageAppsContentProps) => {
  const renderItem = useMemo(() => createManageAppListRenderItem(isSelected, onToggle), [isSelected, onToggle]);

  const listHeader = useMemo(
    () => (
      <>
        {onPickApps ? <IosPickAppsButton isPicking={isPickingApps} onPress={onPickApps} /> : null}
        <ManageAppsListHeader
          selectedApps={selectedApps}
          onSelectedAppPress={onSelectedAppPress}
          onSelectedAppRemove={onSelectedAppRemove}
          isSearchActive={isSearchActive}
          categoryFilters={categoryFilters}
          activeCategoryId={activeCategoryId}
          onCategoryChange={onCategoryChange}
          showCategoryFilters={showInstalledAppsList}
        />
      </>
    ),
    [
      activeCategoryId,
      categoryFilters,
      isPickingApps,
      isSearchActive,
      onCategoryChange,
      onPickApps,
      onSelectedAppPress,
      onSelectedAppRemove,
      selectedApps,
      showInstalledAppsList,
    ],
  );

  const listEmpty = useMemo(() => <ManageAppsListEmpty isFiltering={isFiltering} />, [isFiltering]);

  if (!showInstalledAppsList) {
    return (
      <View style={manageAppsStyles.content} testID={testIds.manageApps.appsList}>
        {listHeader}
      </View>
    );
  }

  return (
    <View style={manageAppsStyles.content} testID={testIds.manageApps.appsList}>
      <View
        style={[manageAppsStyles.listWrapper, (isFiltering || isLoadingApps) && manageAppsStyles.contentDimmed]}
        accessibilityState={isFiltering || isLoadingApps ? { busy: true } : undefined}
      >
        <Activity mode={isFiltering || isLoadingApps ? 'visible' : 'hidden'}>
          <View style={manageAppsStyles.filterLoader} pointerEvents="none">
            <ActivityIndicator
              size="small"
              color={colors.accent}
              accessibilityLabel={isLoadingApps ? 'Loading apps' : 'Filtering apps'}
              testID={isLoadingApps ? testIds.manageApps.appsLoader : testIds.manageApps.appsFilterLoader}
            />
          </View>
        </Activity>

        <FlatList
          style={manageAppsStyles.flatList}
          testID={testIds.manageApps.scroll}
          data={apps}
          extraData={selectedApps}
          renderItem={renderItem}
          keyExtractor={manageAppKeyExtractor}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={listEmpty}
          contentContainerStyle={manageAppsStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="none"
          accessibilityRole="list"
          accessibilityLabel="Installed apps"
          {...APP_LIST_FLAT_LIST_PROPS}
        />
      </View>
    </View>
  );
};
