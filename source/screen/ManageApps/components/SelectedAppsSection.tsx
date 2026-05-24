/** @format */

import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { testIds } from '@/testing/testIds';
import type { ManageApp } from '../types';
import { manageAppsStyles } from '../styles';

type SelectedAppsSectionProps = {
  apps: ManageApp[];
};

const SelectedChip = ({ app }: { app: ManageApp }) => (
  <View style={manageAppsStyles.selectedChip} testID={testIds.manageApps.selectedChip(app.packageName)}>
    <Text style={manageAppsStyles.selectedChipLabel} numberOfLines={1}>
      {app.appName}
    </Text>
  </View>
);

export const SelectedAppsSection = ({ apps }: SelectedAppsSectionProps) => {
  if (!apps.length) {
    return null;
  }

  return (
    <View style={manageAppsStyles.section} testID={testIds.manageApps.selectedSection}>
      <Text style={manageAppsStyles.sectionTitle}>Selected Apps</Text>

      <ScrollView
        horizontal
        nestedScrollEnabled
        removeClippedSubviews
        showsHorizontalScrollIndicator={false}
        style={manageAppsStyles.selectedAppsScroll}
        testID={testIds.manageApps.selectedAppsScroll}
      >
        <View style={manageAppsStyles.selectedAppsRows}>
          {apps.map((app) => (
            <SelectedChip key={app.packageName} app={app} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
