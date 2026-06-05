/** @format */

import React, { memo, useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { testIds } from '@/testing/testIds';

import { manageAppsStyles } from '../styles';
import type { ManageApp, SelectedAppsSectionProps } from '../types';

type SelectedChipProps = {
  app: ManageApp;
  onPress: (packageName: string) => void;
};

const SelectedChip = memo(({ app, onPress }: SelectedChipProps) => {
  const handlePress = useCallback(() => {
    onPress(app.packageName);
  }, [app.packageName, onPress]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Configure limits for ${app.appName}`}
      onPress={handlePress}
      style={manageAppsStyles.selectedChip}
      testID={testIds.manageApps.selectedChip(app.packageName)}
    >
      <Text style={manageAppsStyles.selectedChipLabel} numberOfLines={1}>
        {app.appName}
      </Text>
    </Pressable>
  );
});

SelectedChip.displayName = 'SelectedChip';

/**
 * Horizontal chip strip for already-selected apps.
 *
 * Uses `ScrollView` (not `FlatList`) to preserve the two-row wrapped layout
 * defined in `selectedAppsRows` styles.
 */
const SelectedAppsSectionView = ({ apps, onAppPress }: SelectedAppsSectionProps) => {
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

export const SelectedAppsSection = memo(SelectedAppsSectionView);
