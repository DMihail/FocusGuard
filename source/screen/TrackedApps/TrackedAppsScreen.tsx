/** @format */

import React, { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl } from 'react-native';

import { useGoBack } from '@/hooks/useGoBack';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { useTrackedAppRows } from '@/hooks/useTrackedAppRows';
import { APP_LIST_FLAT_LIST_PROPS } from '@/list';
import { useNavigateToConfigureLimits } from '@/navigation/hooks/useNavigateToConfigureLimits';
import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';

import { createTrackedAppRenderItem, trackedAppKeyExtractor } from './list';
import { trackedAppsStyles } from './styles';

import { TrackedAppsEmpty, TrackedAppsHeader } from './components';
import { ScreenSafeArea } from '@/components';

export const TrackedAppsScreen = () => {
  const goBack = useGoBack();
  const openConfigureLimits = useNavigateToConfigureLimits();
  const { appRows, refreshUsage } = useTrackedAppRows();
  const { refreshing, onRefresh } = usePullToRefresh(refreshUsage);

  const renderItem = useMemo(() => createTrackedAppRenderItem(openConfigureLimits), [openConfigureLimits]);

  const renderListHeader = useCallback(
    () => <TrackedAppsHeader appCount={appRows.length} onBack={goBack} />,
    [appRows.length, goBack],
  );

  return (
    <ScreenSafeArea
      style={trackedAppsStyles.screen}
      testID={testIds.trackedApps.screen}
      accessibilityLabel="Tracked apps"
    >
      <FlatList
        testID={testIds.trackedApps.scroll}
        data={appRows}
        renderItem={renderItem}
        keyExtractor={trackedAppKeyExtractor}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={TrackedAppsEmpty}
        contentContainerStyle={trackedAppsStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        accessibilityRole="list"
        accessibilityLabel="Monitored apps with daily usage"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
            progressBackgroundColor={colors.surfaceDark}
          />
        }
        {...APP_LIST_FLAT_LIST_PROPS}
      />
    </ScreenSafeArea>
  );
};
