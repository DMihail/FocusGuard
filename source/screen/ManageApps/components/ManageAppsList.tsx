/** @format */

import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';
import { APP_LIST_FLAT_LIST_PROPS } from '@/utils/flatListDefaults';

import { manageAppsStyles } from '../styles';
import type { ManageApp } from '../types';
import { ManageAppListItem } from './ManageAppListItem';

type ManageAppsListProps = {
  apps: ManageApp[];
  isFiltering?: boolean;
  selectedCount: number;
  isSelected: (packageName: string) => boolean;
  onToggle: (app: ManageApp) => void;
  ListHeaderComponent: React.ComponentType | React.ReactElement | null;
};

export const ManageAppsList = ({
  apps,
  isFiltering = false,
  selectedCount,
  isSelected,
  onToggle,
  ListHeaderComponent,
}: ManageAppsListProps) => (
  <View style={manageAppsStyles.listFlex} testID={testIds.manageApps.appsList}>
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
        renderItem={({ item }) => (
          <ManageAppListItem {...item} isSelected={isSelected(item.packageName)} onToggle={() => onToggle(item)} />
        )}
        keyExtractor={(item) => item.packageName}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={
          !isFiltering ? (
            <Text style={manageAppsStyles.emptyText} testID={testIds.manageApps.appsEmpty}>
              No apps found
            </Text>
          ) : null
        }
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
