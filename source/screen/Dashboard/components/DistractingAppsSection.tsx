/** @format */

import React, { useCallback } from 'react';
import { Button, Text, View } from 'react-native';

import { Link } from '@react-navigation/native';

import { useRootNavigation } from '@/navigation';
import { monitoringStore, selectedAppsStore } from '@/store';
import { testIds } from '@/testing/testIds';

import { dashboardStyles } from '../styles';
import { DistractingAppRow } from './DistractingAppRow';

export const DistractingAppsSection = () => {
  const navigation = useRootNavigation();
  const selectedApps = selectedAppsStore((state) => state.apps);
  const isMonitoring = monitoringStore((state) => state.isMonitoring);
  const toggleMonitoring = monitoringStore((state) => state.toggle);

  const openConfigureLimits = useCallback(
    (packageName: string) => {
      navigation.navigate('ConfigureLimits', { packageName });
    },
    [navigation],
  );

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
          selectedApps.map((app) => <DistractingAppRow key={app.packageName} {...app} onPress={openConfigureLimits} />)
        )}
      </View>

      {!!selectedApps.length && (
        <Button
          title={isMonitoring ? 'Stop' : 'Start'}
          color={isMonitoring ? '#e74c3c' : undefined}
          onPress={toggleMonitoring}
        />
      )}
    </View>
  );
};
