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

  const firstRow = apps.slice(0, Math.ceil(apps.length / 2));
  const secondRow = apps.slice(Math.ceil(apps.length / 2));

  return (
    <View style={manageAppsStyles.section} testID={testIds.manageApps.selectedSection}>
      <Text style={manageAppsStyles.sectionTitle}>Selected Apps</Text>

      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        style={manageAppsStyles.selectedAppsScroll}
        contentContainerStyle={manageAppsStyles.selectedAppsScrollContent}
        testID={testIds.manageApps.selectedAppsScroll}
      >
        <View style={manageAppsStyles.selectedAppsRows}>
          <View style={manageAppsStyles.selectedAppsRow}>
            {firstRow.map((app) => (
              <SelectedChip key={app.packageName} app={app} />
            ))}
          </View>

          {secondRow.length > 0 ? (
            <View style={manageAppsStyles.selectedAppsRow}>
              {secondRow.map((app) => (
                <SelectedChip key={app.packageName} app={app} />
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};
