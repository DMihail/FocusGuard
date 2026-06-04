/** @format */

import React from 'react';
import { RefreshControl, ScrollView } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useRootNavigation } from '@/navigation';
import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';

import { useDashboard } from './hooks';
import { dashboardStyles } from './styles';
import { getGreeting } from './utils';

import {
  DailyStatsRow,
  DashboardHeader,
  DistractingAppsSection,
  FocusOverviewCard,
  QuickActionsSection,
} from './components';

export const DashboardScreen = () => {
  const navigation = useRootNavigation();
  const greeting = getGreeting();
  const {
    appRows,
    summary,
    hasSelectedApps,
    isMonitoring,
    toggleMonitoring,
    openConfigureLimits,
    monitoringSubtitle,
    refreshing,
    onRefresh,
  } = useDashboard();

  return (
    <SafeAreaView style={dashboardStyles.screen} edges={['top', 'bottom']} testID={testIds.dashboard.screen}>
      <ScrollView
        testID={testIds.dashboard.scroll}
        contentContainerStyle={dashboardStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
            progressBackgroundColor={colors.surfaceDark}
          />
        }
      >
        <DashboardHeader greeting={greeting} onSettingsPress={() => navigation.navigate('Settings')} />

        <FocusOverviewCard summary={summary} />

        <DailyStatsRow summary={summary} />

        <DistractingAppsSection appRows={appRows} onConfigureLimits={openConfigureLimits} />

        <QuickActionsSection
          isMonitoring={isMonitoring}
          canStartFocusMode={hasSelectedApps}
          monitoringSubtitle={monitoringSubtitle}
          onToggleMonitoring={toggleMonitoring}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
