/** @format */

import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { Button, FlatList, Text, View } from 'react-native';

import { Link } from '@react-navigation/native';

import { APP_LIST_FLAT_LIST_PROPS } from '@/list';
import { useDistractingAppsSection } from '@/screen/Dashboard/hooks';
import { manageAppKeyExtractor } from '@/screen/ManageApps/list';
import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';
import { configureSectionLayoutAnimation } from '@/utils/layoutAnimation';

import { createDistractingAppRenderItem, DistractingAppsListEmpty } from '../list';
import { dashboardStyles } from '../styles';

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

  const renderItem = useMemo(() => createDistractingAppRenderItem(openConfigureLimits), [openConfigureLimits]);

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
        keyExtractor={manageAppKeyExtractor}
        scrollEnabled={false}
        nestedScrollEnabled
        ListEmptyComponent={DistractingAppsListEmpty}
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
