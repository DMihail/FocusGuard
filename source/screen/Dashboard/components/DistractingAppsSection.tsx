/** @format */

import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { FlatList, Text, View } from 'react-native';

import { Link } from '@react-navigation/native';

import { APP_LIST_FLAT_LIST_PROPS } from '@/list';
import { manageAppKeyExtractor } from '@/screen/ManageApps/list';
import { testIds } from '@/testing/testIds';
import { configureSectionLayoutAnimation } from '@/utils/layoutAnimation';
import type { DashboardAppRow } from '@/utils/usage/dashboardStats';

import { createDistractingAppRenderItem, DistractingAppsListEmpty } from '../list';
import { dashboardStyles } from '../styles';

type DistractingAppsSectionProps = {
  appRows: DashboardAppRow[];
  onConfigureLimits: (packageName: string) => void;
};

export const DistractingAppsSection = ({ appRows, onConfigureLimits }: DistractingAppsSectionProps) => {
  const previousAppsCount = useRef(appRows.length);

  useLayoutEffect(() => {
    if (previousAppsCount.current !== appRows.length) {
      configureSectionLayoutAnimation();
      previousAppsCount.current = appRows.length;
    }
  }, [appRows.length]);

  const renderItem = useMemo(() => createDistractingAppRenderItem(onConfigureLimits), [onConfigureLimits]);

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
        <Link
          screen="ManageApps"
          testID={testIds.dashboard.viewAllAppsButton}
          accessibilityRole="button"
          accessibilityLabel="View all apps"
          style={dashboardStyles.viewAllButton}
        >
          <Text style={dashboardStyles.viewAllText}>View All</Text>
        </Link>
      </View>

      <FlatList
        data={appRows}
        renderItem={renderItem}
        keyExtractor={manageAppKeyExtractor}
        scrollEnabled={false}
        nestedScrollEnabled
        ListEmptyComponent={DistractingAppsListEmpty}
        testID={testIds.dashboard.appsList}
        accessibilityRole="list"
        accessibilityLabel="Selected distracting apps"
        extraData={appRows}
        {...APP_LIST_FLAT_LIST_PROPS}
      />
    </View>
  );
};
