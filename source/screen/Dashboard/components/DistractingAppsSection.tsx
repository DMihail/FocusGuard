import React, { memo, useLayoutEffect, useMemo, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';

import { getManageAppKey } from '@/domain/appKey';
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
  onConfigureLimits: (appKey: string) => void;
  onViewAllPress: () => void;
};

const areVisibleAppRowsEqual = (previous: DashboardAppRow[], next: DashboardAppRow[]): boolean => {
  const visibleCount = Math.min(MAX_VISIBLE_APPS, previous.length, next.length);

  for (let index = 0; index < visibleCount; index += 1) {
    const left = previous[index];
    const right = next[index];

    if (
      !left ||
      !right ||
      getManageAppKey(left) !== getManageAppKey(right) ||
      left.usedMs !== right.usedMs ||
      left.limitMs !== right.limitMs ||
      left.percentUsed !== right.percentUsed ||
      left.isOverLimit !== right.isOverLimit
    ) {
      return false;
    }
  }

  return true;
};

const areDistractingAppsSectionPropsEqual = (
  previous: DistractingAppsSectionProps,
  next: DistractingAppsSectionProps,
): boolean =>
  previous.appRows.length === next.appRows.length &&
  areVisibleAppRowsEqual(previous.appRows, next.appRows) &&
  previous.onConfigureLimits === next.onConfigureLimits &&
  previous.onViewAllPress === next.onViewAllPress;

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
            visibleApps.map((app) => <AppUsageRow key={getManageAppKey(app)} {...app} onPress={onConfigureLimits} />)
          )}
        </View>
      </View>
    );
  },
  areDistractingAppsSectionPropsEqual,
);
