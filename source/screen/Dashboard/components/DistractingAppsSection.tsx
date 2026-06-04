/** @format */

import React, { memo, useLayoutEffect, useMemo, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';

import { testIds } from '@/testing/testIds';
import { configureSectionLayoutAnimation } from '@/utils/layoutAnimation';
import type { DashboardAppRow } from '@/utils/usage/dashboardStats';

import { DistractingAppsListEmpty } from '../list';
import { dashboardStyles } from '../styles';

import { AppUsageRow } from '@/components';

const MAX_VISIBLE_APPS = 4;

type DistractingAppsSectionProps = {
  appRows: DashboardAppRow[];
  onConfigureLimits: (packageName: string) => void;
  onViewAllPress: () => void;
};

function DistractingAppsSectionView({ appRows, onConfigureLimits, onViewAllPress }: DistractingAppsSectionProps) {
  const visibleApps = useMemo(() => appRows.slice(0, MAX_VISIBLE_APPS), [appRows]);
  const previousAppsCount = useRef(visibleApps.length);

  useLayoutEffect(() => {
    if (previousAppsCount.current !== visibleApps.length) {
      configureSectionLayoutAnimation();
      previousAppsCount.current = visibleApps.length;
    }
  }, [visibleApps.length]);

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
        {appRows.length > MAX_VISIBLE_APPS ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View all tracked apps"
            onPress={onViewAllPress}
            style={dashboardStyles.viewAllButton}
            testID={testIds.dashboard.viewAllAppsButton}
          >
            <Text style={dashboardStyles.viewAllText}>View All</Text>
          </Pressable>
        ) : null}
      </View>

      <View
        style={dashboardStyles.appsList}
        testID={testIds.dashboard.appsList}
        accessibilityRole="list"
        accessibilityLabel="Selected distracting apps"
      >
        {visibleApps.length === 0 ? (
          <DistractingAppsListEmpty />
        ) : (
          visibleApps.map((row) => <AppUsageRow key={row.packageName} {...row} onPress={onConfigureLimits} />)
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
  return (
    previous.onConfigureLimits === next.onConfigureLimits &&
    previous.onViewAllPress === next.onViewAllPress &&
    previous.appRows === next.appRows
  );
}
