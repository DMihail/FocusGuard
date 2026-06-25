/** @format */

import React, { useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';

import { useGoBack } from '@/hooks/useGoBack';
import { useTrackedAppRows } from '@/hooks/useTrackedAppRows';
import { useTrackedAppsRefresh } from '@/hooks/useTrackedAppsRefresh';
import { useTranslation } from '@/i18n';
import { APP_LIST_FLAT_LIST_PROPS } from '@/list';
import { useNavigateToConfigureLimits } from '@/navigation/hooks/useNavigateToConfigureLimits';
import { testIds } from '@/testing/testIds';

import { createTrackedAppRenderItem, trackedAppKeyExtractor } from './list';
import { useTrackedAppsStyles } from './styles';

import { TrackedAppsEmpty, TrackedAppsHeader } from './components';
import { ScreenSafeArea, UsageRefreshIndicator } from '@/components';

export const TrackedAppsScreen = () => {
  const styles = useTrackedAppsStyles();
  const { t } = useTranslation();
  const goBack = useGoBack();
  const openConfigureLimits = useNavigateToConfigureLimits();
  const { appRows, showUsageRefreshIndicator, refreshUsage } = useTrackedAppRows();
  const { refreshControl, refreshing: isPullRefreshing } = useTrackedAppsRefresh(refreshUsage);

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
      style={styles.screen}
      testID={testIds.trackedApps.screen}
      accessibilityLabel={t('trackedApps.screenLabel')}
    >
      <View style={styles.content}>
        <FlatList
          testID={testIds.trackedApps.list}
          data={appRows}
          renderItem={renderItem}
          keyExtractor={trackedAppKeyExtractor}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={TrackedAppsEmpty}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          accessibilityRole="list"
          accessibilityLabel={t('trackedApps.listA11y')}
          refreshControl={refreshControl}
          {...APP_LIST_FLAT_LIST_PROPS}
        />
        <UsageRefreshIndicator
          visible={showUsageRefreshIndicator && !isPullRefreshing}
          testID={testIds.trackedApps.usageLoader}
        />
      </View>
    </ScreenSafeArea>
  );
};
