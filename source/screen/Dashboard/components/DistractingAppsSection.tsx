/** @format */

import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Link } from '@react-navigation/native';
import { requestUsageStatsPermission } from '@/specs';
import { selectedAppsStore } from '@/store';
import { testIds } from '@/testing/testIds';
import { dashboardStyles } from '../styles';
import { DistractingAppRow } from './DistractingAppRow';

export const DistractingAppsSection = () => {
  const selectedApps = selectedAppsStore((state) => state.apps);

  useEffect(() => {
    requestUsageStatsPermission();
  }, []);

  return (
    <View style={dashboardStyles.section} testID={testIds.dashboard.distractingAppsSection}>
      <View style={dashboardStyles.sectionHeader}>
        <Text style={dashboardStyles.sectionTitle}>Top Distracting Apps</Text>
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

      <View style={dashboardStyles.appsList} testID={testIds.dashboard.appsList}>
        {!selectedApps.length ? (
          <Text style={dashboardStyles.emptyText} testID={testIds.dashboard.appsEmpty}>
            No apps selected yet
          </Text>
        ) : (
          selectedApps.map((app) => <DistractingAppRow key={app.packageName} {...app} />)
        )}
      </View>
    </View>
  );
};
