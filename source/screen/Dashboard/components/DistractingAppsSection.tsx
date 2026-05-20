/** @format */

import React, { useEffect, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { getAppsUsageStats, requestUsageStatsPermission } from '../../../specs';
import { dashboardStyles } from '../styles';
import { testIds } from '../../../testing/testIds';
import { DistractingAppRow } from './DistractingAppRow';

const TOP_APPS_LIMIT = 4;

export const DistractingAppsSection = () => {
  const apps = useMemo(() => getAppsUsageStats().slice(0, TOP_APPS_LIMIT), []);

  useEffect(() => {
    requestUsageStatsPermission();
  }, []);
  return (
    <View style={dashboardStyles.section} testID={testIds.dashboard.distractingAppsSection}>
      <View style={dashboardStyles.sectionHeader}>
        <Text style={dashboardStyles.sectionTitle}>Top Distracting Apps</Text>
        {apps.length ? (
          <Pressable
            testID={testIds.dashboard.viewAllAppsButton}
            accessibilityRole="button"
            accessibilityLabel="View all apps"
            style={dashboardStyles.viewAllButton}
          >
            <Text style={dashboardStyles.viewAllText}>View All</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={dashboardStyles.appsList} testID={testIds.dashboard.appsList}>
        {!apps.length ? (
          <Text style={dashboardStyles.emptyText} testID={testIds.dashboard.appsEmpty}>
            No apps to show yet
          </Text>
        ) : (
          apps.map((app) => <DistractingAppRow key={app.packageName} {...app} />)
        )}
      </View>
    </View>
  );
};
