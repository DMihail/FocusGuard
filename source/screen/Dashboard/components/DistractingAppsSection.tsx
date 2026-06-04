/** @format */

import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { Button, FlatList, type ListRenderItem, Text, View } from 'react-native';

import { Link } from '@react-navigation/native';

import { useDistractingAppsSection } from '@/screen/Dashboard/hooks';
import type { ManageApp } from '@/screen/ManageApps/types';
import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';
import { APP_LIST_FLAT_LIST_PROPS } from '@/utils/flatListDefaults';
import { configureSectionLayoutAnimation } from '@/utils/layoutAnimation';

import { dashboardStyles } from '../styles';
import { DistractingAppRow } from './DistractingAppRow';

export const DistractingAppsSection = () => {
  const { selectedApps, isMonitoring, monitoringButtonTitle, toggleMonitoring, openConfigureLimits } =
    useDistractingAppsSection();

  const previousAppsCount = useRef(selectedApps.length);

  useLayoutEffect(() => {
    if (previousAppsCount.current !== selectedApps.length) {
      configureSectionLayoutAnimation();
      previousAppsCount.current = selectedApps.length;
    }
  }, [selectedApps.length]);

  const renderItem: ListRenderItem<ManageApp> = useCallback(
    ({ item }) => <DistractingAppRow {...item} onPress={openConfigureLimits} />,
    [openConfigureLimits],
  );

  const keyExtractor = useCallback((item: ManageApp) => item.packageName, []);

  const listEmptyComponent = useCallback(
    () => (
      <Text style={dashboardStyles.emptyText} testID={testIds.dashboard.appsEmpty}>
        No apps selected yet
      </Text>
    ),
    [],
  );

  return (
    <View
      style={dashboardStyles.section}
      testID={testIds.dashboard.distractingAppsSection}
      accessibilityRole="summary"
      accessibilityLabel="Top distracting apps"
    >
      <View style={dashboardStyles.sectionHeader}>
        <Text style={dashboardStyles.sectionTitle} accessibilityRole="header">
          Top Distracting Apps
        </Text>
        <Link
          screen={'ManageApps'}
          testID={testIds.dashboard.viewAllAppsButton}
          accessibilityRole="button"
          accessibilityLabel="View all apps"
          style={dashboardStyles.viewAllButton}
        >
          <Text style={dashboardStyles.viewAllText}>View All</Text>
        </Link>
      </View>

      <FlatList
        data={selectedApps}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        scrollEnabled={false}
        nestedScrollEnabled
        ListEmptyComponent={listEmptyComponent}
        testID={testIds.dashboard.appsList}
        accessibilityRole="list"
        accessibilityLabel="Selected distracting apps"
        extraData={selectedApps.length}
        {...APP_LIST_FLAT_LIST_PROPS}
      />

      {!!selectedApps.length && (
        <Button
          title={monitoringButtonTitle}
          color={isMonitoring ? colors.danger : undefined}
          onPress={toggleMonitoring}
          accessibilityLabel={monitoringButtonTitle}
        />
      )}
    </View>
  );
};
