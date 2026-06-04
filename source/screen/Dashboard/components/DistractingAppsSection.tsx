/** @format */

import React from 'react';
import { Button, Text, View } from 'react-native';

import { Link } from '@react-navigation/native';

import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';

import { useDistractingAppsSection } from '../hooks/useDistractingAppsSection';
import { dashboardStyles } from '../styles';
import { DistractingAppRow } from './DistractingAppRow';

export const DistractingAppsSection = () => {
  const { selectedApps, isMonitoring, monitoringButtonTitle, toggleMonitoring, openConfigureLimits } =
    useDistractingAppsSection();

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
          title={monitoringButtonTitle}
          color={isMonitoring ? colors.danger : undefined}
          onPress={toggleMonitoring}
        />
      )}
    </View>
  );
};
