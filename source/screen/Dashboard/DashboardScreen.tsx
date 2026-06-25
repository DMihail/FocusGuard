/** @format */

import React, { useCallback, useMemo } from 'react';
import { ScrollView, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { useRootNavigation } from '@/navigation';
import { testIds } from '@/testing/testIds';

import { useDashboard } from './hooks/useDashboard';
import { DASHBOARD_SECTIONS, type DashboardSectionRenderContext, renderDashboardSection } from './list';
import { useDashboardStyles } from './styles';
import { getGreeting } from './utils';

import { DashboardHeader } from './components';
import { ScreenSafeArea, UsageRefreshIndicator } from '@/components';

export const DashboardScreen = () => {
  const styles = useDashboardStyles();
  const navigation = useRootNavigation();
  const { t } = useTranslation();
  const greeting = useMemo(() => getGreeting(t), [t]);

  const {
    appRows,
    summary,
    hasSelectedApps,
    isMonitoring,
    toggleMonitoring,
    openConfigureLimits,
    monitoringSubtitle,
    refreshControl,
    showUsageRefreshIndicator,
    isPullRefreshing,
  } = useDashboard();

  const openSettings = useCallback(() => {
    navigation.navigate('Settings');
  }, [navigation]);

  const openManageApps = useCallback(() => {
    navigation.navigate('ManageApps');
  }, [navigation]);

  const openTrackedApps = useCallback(() => {
    navigation.navigate('TrackedApps');
  }, [navigation]);

  const sectionContext = useMemo<DashboardSectionRenderContext>(
    () => ({
      summary,
      appRows,
      isMonitoring,
      hasSelectedApps,
      monitoringSubtitle,
      onConfigureLimits: openConfigureLimits,
      onViewAllPress: openTrackedApps,
      onToggleMonitoring: toggleMonitoring,
      onOpenManageApps: openManageApps,
    }),
    [
      appRows,
      hasSelectedApps,
      isMonitoring,
      monitoringSubtitle,
      openConfigureLimits,
      openManageApps,
      openTrackedApps,
      summary,
      toggleMonitoring,
    ],
  );

  return (
    <ScreenSafeArea
      style={styles.screen}
      testID={testIds.dashboard.screen}
      accessibilityLabel={t('dashboard.screenLabel')}
    >
      <View style={styles.content}>
        <ScrollView
          testID={testIds.dashboard.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={refreshControl}
        >
          <DashboardHeader greeting={greeting} onSettingsPress={openSettings} />
          {DASHBOARD_SECTIONS.map((sectionId) => (
            <React.Fragment key={sectionId}>{renderDashboardSection(sectionId, sectionContext)}</React.Fragment>
          ))}
        </ScrollView>
        <UsageRefreshIndicator
          visible={showUsageRefreshIndicator && !isPullRefreshing}
          testID={testIds.dashboard.usageLoader}
        />
      </View>
    </ScreenSafeArea>
  );
};
