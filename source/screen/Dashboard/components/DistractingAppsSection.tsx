/** @format */

import React, { memo, useLayoutEffect, useRef } from 'react';
import { Text, View } from 'react-native';

import { Link } from '@react-navigation/native';

import { testIds } from '@/testing/testIds';
import { configureSectionLayoutAnimation } from '@/utils/layoutAnimation';
import type { DashboardAppRow } from '@/utils/usage/dashboardStats';

import { DistractingAppsListEmpty } from '../list';
import { dashboardStyles } from '../styles';
import { DistractingAppRow } from './DistractingAppRow';

type DistractingAppsSectionProps = {
  appRows: DashboardAppRow[];
  onConfigureLimits: (packageName: string) => void;
};

function DistractingAppsSectionView({ appRows, onConfigureLimits }: DistractingAppsSectionProps) {
  const previousAppsCount = useRef(appRows.length);

  useLayoutEffect(() => {
    if (previousAppsCount.current !== appRows.length) {
      configureSectionLayoutAnimation();
      previousAppsCount.current = appRows.length;
    }
  }, [appRows.length]);

  return (
    <View
      style={dashboardStyles.section}
      testID={testIds.dashboard.distractingAppsSection}
      accessibilityRole="summary"
      accessibilityLabel="Top distracting apps"
    >
      <View style={dashboardStyles.sectionHeader}>
        <Text style={dashboardStyles.sectionTitle} accessibilityRole="header" numberOfLines={1}>
          Top Distracting Apps
        </Text>
        {appRows.length > 0 ? (
          <Link
            screen="ManageApps"
            testID={testIds.dashboard.viewAllAppsButton}
            accessibilityRole="button"
            accessibilityLabel="View all apps"
            style={dashboardStyles.viewAllButton}
          >
            <Text style={dashboardStyles.viewAllText}>View All</Text>
          </Link>
        ) : null}
      </View>

      <View testID={testIds.dashboard.appsList} accessibilityRole="list" accessibilityLabel="Selected distracting apps">
        {appRows.length === 0 ? (
          <DistractingAppsListEmpty />
        ) : (
          appRows.map((row) => <DistractingAppRow key={row.packageName} {...row} onPress={onConfigureLimits} />)
        )}
      </View>
    </View>
  );
}

export const DistractingAppsSection = memo(DistractingAppsSectionView, areDistractingAppsSectionPropsEqual);

function areDistractingAppsSectionPropsEqual(
  previous: DistractingAppsSectionProps,
  next: DistractingAppsSectionProps,
): boolean {
  return previous.onConfigureLimits === next.onConfigureLimits && previous.appRows === next.appRows;
}
