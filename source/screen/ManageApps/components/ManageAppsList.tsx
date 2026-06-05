/** @format */

import React, { memo, useMemo } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { APP_LIST_FLAT_LIST_PROPS } from '@/list';
import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';

import { createManageAppListRenderItem, manageAppKeyExtractor, ManageAppsListEmpty } from '../list';
import { manageAppsStyles } from '../styles';
import type { ManageApp } from '../types';
import { AppSearchField } from './AppSearchField';

type ManageAppsListProps = {
  apps: ManageApp[];
  isFiltering?: boolean;
  selectedCount: number;
  isSelected: (packageName: string) => boolean;
  onToggle: (app: ManageApp) => void;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  ListHeaderComponent: React.ComponentType | React.ReactElement | null | (() => React.ReactElement | null);
};

const ManageAppsListView = ({
  apps,
  isFiltering = false,
  selectedCount,
  isSelected,
  onToggle,
  searchQuery,
  onSearchChange,
  ListHeaderComponent,
}: ManageAppsListProps) => {
  const renderItem = useMemo(() => createManageAppListRenderItem(isSelected, onToggle), [isSelected, onToggle]);
  const listEmptyComponent = useMemo(() => <ManageAppsListEmpty isFiltering={isFiltering} />, [isFiltering]);

  return (
    <View style={manageAppsStyles.listFlex} testID={testIds.manageApps.appsList}>
      <View style={manageAppsStyles.searchFieldContainer}>
        <AppSearchField value={searchQuery} onChangeText={onSearchChange} />
      </View>

      <View
        style={[manageAppsStyles.appsListContainer, isFiltering && manageAppsStyles.appsListDimmed]}
        accessibilityState={{ busy: isFiltering }}
      >
        {isFiltering ? (
          <View style={manageAppsStyles.filterLoader} testID={testIds.manageApps.appsFilterLoader}>
            <ActivityIndicator size="small" color={colors.accent} accessibilityLabel="Filtering apps" />
          </View>
        ) : null}

        <FlatList
          testID={testIds.manageApps.scroll}
          data={apps}
          renderItem={renderItem}
          keyExtractor={manageAppKeyExtractor}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={listEmptyComponent}
          contentContainerStyle={manageAppsStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          accessibilityRole="list"
          accessibilityLabel="Installed apps"
          extraData={selectedCount}
          {...APP_LIST_FLAT_LIST_PROPS}
        />
      </View>
    </View>
  );
};

export const ManageAppsList = memo(ManageAppsListView);
