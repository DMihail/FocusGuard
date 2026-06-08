import React, { memo, useLayoutEffect, useMemo, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';

import { testIds } from '@/testing/testIds';
import { spacing } from '@/theme';
import { configureSectionLayoutAnimation } from '@/utils/layoutAnimation';
import type { DashboardAppRow } from '@/utils/usage/dashboardStats';

import { DistractingAppsListEmpty } from '../list/empty';
import { dashboardStyles } from '../styles';

import { AppUsageRow } from '@/components';

const MAX_VISIBLE_APPS = 4;

type DistractingAppsSectionProps = {
  appRows: DashboardAppRow[];
  onConfigureLimits: (packageName: string) => void;
  onViewAllPress: () => void;
};

export const DistractingAppsSection = memo(
  ({ appRows, onConfigureLimits, onViewAllPress }: DistractingAppsSectionProps) => {
    const visibleApps = useMemo(() => appRows.slice(0, MAX_VISIBLE_APPS), [appRows]);
    const previousAppsCount = useRef(visibleApps.length);

    useLayoutEffect(() => {
      if (previousAppsCount.current !== visibleApps.length) {
        configureSectionLayoutAnimation();
        previousAppsCount.current = visibleApps.length;
      }
    }, [visibleApps.length]);

    return (
      <View style={dashboardStyles.section} testID={testIds.dashboard.distractingAppsSection}>
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
          style={[dashboardStyles.appsList, { gap: spacing.md }]}
          testID={testIds.dashboard.appsList}
          accessibilityRole="list"
        >
          {visibleApps.length === 0 ? (
            <DistractingAppsListEmpty />
          ) : (
            visibleApps.map((app) => <AppUsageRow key={app.packageName} {...app} onPress={onConfigureLimits} />)
          )}
        </View>
      </View>
    );
  },
);
