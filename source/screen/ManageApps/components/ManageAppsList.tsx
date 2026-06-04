/** @format */

import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';

import { manageAppsStyles } from '../styles';
import type { ManageApp } from '../types';
import { ManageAppListItem } from './ManageAppListItem';

type ManageAppsListProps = {
  apps: ManageApp[];
  isFiltering?: boolean;
  isSelected: (packageName: string) => boolean;
  onToggle: (app: ManageApp) => void;
};

export const ManageAppsList = ({ apps, isFiltering = false, isSelected, onToggle }: ManageAppsListProps) => (
  <View style={manageAppsStyles.section} testID={testIds.manageApps.appsList}>
    <View
      style={[manageAppsStyles.appsListContainer, isFiltering && manageAppsStyles.appsListDimmed]}
      accessibilityState={{ busy: isFiltering }}
    >
      {isFiltering ? (
        <View style={manageAppsStyles.filterLoader} testID={testIds.manageApps.appsFilterLoader}>
          <ActivityIndicator size="small" color={colors.accent} accessibilityLabel="Filtering apps" />
        </View>
      ) : null}

      {!apps.length && !isFiltering ? (
        <Text style={manageAppsStyles.emptyText} testID={testIds.manageApps.appsEmpty}>
          No apps found
        </Text>
      ) : null}

      {apps.length > 0 ? (
        <View style={manageAppsStyles.appsList}>
          {apps.map((app) => (
            <ManageAppListItem
              key={app.packageName}
              {...app}
              isSelected={isSelected(app.packageName)}
              onToggle={() => onToggle(app)}
            />
          ))}
        </View>
      ) : null}
    </View>
  </View>
);
