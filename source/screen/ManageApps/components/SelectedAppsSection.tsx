/** @format */

import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { testIds } from '@/testing/testIds';

import { manageAppsStyles } from '../styles';
import type { ManageApp, SelectedAppsSectionProps } from '../types';

const SelectedChip = ({ app, onPress }: { app: ManageApp; onPress: (packageName: string) => void }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`Configure limits for ${app.appName}`}
    onPress={() => onPress(app.packageName)}
    style={manageAppsStyles.selectedChip}
    testID={testIds.manageApps.selectedChip(app.packageName)}
  >
    <Text style={manageAppsStyles.selectedChipLabel} numberOfLines={1}>
      {app.appName}
    </Text>
  </Pressable>
);

export const SelectedAppsSection = ({ apps, onAppPress }: SelectedAppsSectionProps) => {
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
            <SelectedChip key={app.packageName} app={app} onPress={onAppPress} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
