/** @format */

import React, { useCallback, useMemo } from 'react';
import { FlatList } from 'react-native';

import { SECTION_SCROLL_FLAT_LIST_PROPS } from '@/list';
import { useRootNavigation } from '@/navigation';
import { testIds } from '@/testing/testIds';

import { useDashboard } from './hooks';
import {
  createDashboardSectionRenderItem,
  DASHBOARD_SECTIONS,
  dashboardSectionKeyExtractor,
  type DashboardSectionRenderContext,
} from './list';
import { dashboardStyles } from './styles';
import { getGreeting } from './utils';

import { DashboardHeader } from './components';
import { ScreenSafeArea } from '@/components';

export const DashboardScreen = () => {
  const navigation = useRootNavigation();
  const greeting = useMemo(() => getGreeting(), []);

  const {
    appRows,
    summary,
    hasSelectedApps,
    isMonitoring,
    toggleMonitoring,
    openConfigureLimits,
    monitoringSubtitle,
    refreshControl,
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

  const renderItem = useMemo(() => createDashboardSectionRenderItem(sectionContext), [sectionContext]);

  const listHeader = useMemo(
    () => <DashboardHeader greeting={greeting} onSettingsPress={openSettings} />,
    [greeting, openSettings],
  );

  return (
    <ScreenSafeArea style={dashboardStyles.screen} testID={testIds.dashboard.screen} accessibilityLabel="Dashboard">
      <FlatList
        testID={testIds.dashboard.scroll}
        data={DASHBOARD_SECTIONS}
        renderItem={renderItem}
        keyExtractor={dashboardSectionKeyExtractor}
        ListHeaderComponent={listHeader}
        contentContainerStyle={dashboardStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
        extraData={sectionContext}
        {...SECTION_SCROLL_FLAT_LIST_PROPS}
      />
    </ScreenSafeArea>
  );
};
