/** @format */

import React from 'react';
import { Text, View } from 'react-native';
import { testIds } from '../../../testing/testIds';
import type { ManageApp } from '../types';
import { manageAppsStyles } from '../styles';
import { ManageAppListItem } from './ManageAppListItem';

type ManageAppsListProps = {
  apps: ManageApp[];
  isSelected: (packageName: string) => boolean;
  onToggle: (app: ManageApp) => void;
};

export const ManageAppsList = ({ apps, isSelected, onToggle }: ManageAppsListProps) => (
  <View style={manageAppsStyles.section} testID={testIds.manageApps.appsList}>
    {!apps.length ? (
      <Text style={manageAppsStyles.emptyText} testID={testIds.manageApps.appsEmpty}>
        No apps found
      </Text>
    ) : (
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
    )}
  </View>
);
