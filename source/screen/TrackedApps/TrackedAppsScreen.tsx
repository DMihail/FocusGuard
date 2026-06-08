/** @format */

import React, { useCallback, useMemo } from 'react';
import { FlatList } from 'react-native';

import { useGoBack } from '@/hooks/useGoBack';
import { useTrackedAppRows } from '@/hooks/useTrackedAppRows';
import { useTrackedAppsRefresh } from '@/hooks/useTrackedAppsRefresh';
import { APP_LIST_FLAT_LIST_PROPS } from '@/list';
import { useNavigateToConfigureLimits } from '@/navigation/hooks/useNavigateToConfigureLimits';
import { testIds } from '@/testing/testIds';

import { createTrackedAppRenderItem, trackedAppKeyExtractor } from './list';
import { trackedAppsStyles } from './styles';

import { TrackedAppsEmpty, TrackedAppsHeader } from './components';
import { ScreenSafeArea } from '@/components';

export const TrackedAppsScreen = () => {
  const goBack = useGoBack();
  const openConfigureLimits = useNavigateToConfigureLimits();
  const { appRows, refreshUsage } = useTrackedAppRows();
  const { refreshControl } = useTrackedAppsRefresh(refreshUsage);

  const renderItem = useMemo(
    () => createTrackedAppRenderItem(openConfigureLimits, testIds.trackedApps.appRow),
    [openConfigureLimits],
  );

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
        testID={testIds.trackedApps.list}
        data={appRows}
        extraData={appRows}
        renderItem={renderItem}
        keyExtractor={trackedAppKeyExtractor}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={TrackedAppsEmpty}
        contentContainerStyle={trackedAppsStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        accessibilityRole="list"
        accessibilityLabel="Monitored apps with daily usage"
        refreshControl={refreshControl}
        {...APP_LIST_FLAT_LIST_PROPS}
      />
    </ScreenSafeArea>
  );
};
