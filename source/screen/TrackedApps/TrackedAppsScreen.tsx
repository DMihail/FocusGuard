/** @format */

import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useGoBack } from '@/hooks/useGoBack';
import { useTrackedAppRows } from '@/hooks/useTrackedAppRows';
import { useNavigateToConfigureLimits } from '@/navigation/hooks/useNavigateToConfigureLimits';
import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';

import { trackedAppsStyles } from './styles';

import { TrackedAppsEmpty, TrackedAppsHeader } from './components';
import { DistractingAppRow } from '@/screen/Dashboard/components/DistractingAppRow';

export const TrackedAppsScreen = () => {
  const goBack = useGoBack();
  const openConfigureLimits = useNavigateToConfigureLimits();
  const { appRows, refreshUsage } = useTrackedAppRows();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshUsage();
    requestAnimationFrame(() => {
      setRefreshing(false);
    });
  }, [refreshUsage]);

  return (
    <SafeAreaView
      style={trackedAppsStyles.screen}
      edges={['top', 'bottom']}
      testID={testIds.trackedApps.screen}
      accessibilityLabel="Tracked apps"
    >
      <ScrollView
        testID={testIds.trackedApps.scroll}
        contentContainerStyle={trackedAppsStyles.scrollContent}
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
        <TrackedAppsHeader appCount={appRows.length} onBack={goBack} />

        <View
          style={trackedAppsStyles.list}
          testID={testIds.trackedApps.list}
          accessibilityRole="list"
          accessibilityLabel="Monitored apps with daily usage"
        >
          {appRows.length === 0 ? (
            <TrackedAppsEmpty />
          ) : (
            appRows.map((row) => <DistractingAppRow key={row.packageName} {...row} onPress={openConfigureLimits} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
