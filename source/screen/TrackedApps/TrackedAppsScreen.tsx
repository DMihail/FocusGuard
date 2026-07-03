/** @format */

import React, { useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';

import { useGoBack } from '@/hooks/useGoBack';
import { useScrollContentContainerStyle } from '@/hooks/useScrollContentContainerStyle';
import { useTrackedAppRows } from '@/hooks/useTrackedAppRows';
import { useTrackedAppsRefresh } from '@/hooks/useTrackedAppsRefresh';
import { useTranslation } from '@/i18n';
import { APP_LIST_FLAT_LIST_PROPS, createAppUsageRowRenderItem as createTrackedAppRenderItem } from '@/list';
import { keyByManageApp as trackedAppKeyExtractor } from '@/list/keys';
import { useNavigateToConfigureLimits } from '@/navigation/hooks/useNavigateToConfigureLimits';
import { testIds } from '@/testing/testIds';
import { buildAppRowsSnapshotKey } from '@/utils/usage/appRowsSnapshotKey';

import { getTrackedAppListItemLayout } from './list/layout';
import { useTrackedAppsStyles } from './styles';

import { TrackedAppsEmpty } from './components/TrackedAppsEmpty';
import { TrackedAppsHeader } from './components/TrackedAppsHeader';
import { ScreenSafeArea, UsageRefreshIndicator } from '@/components';

export const TrackedAppsScreen = () => {
  const styles = useTrackedAppsStyles();
  const { scrollContentContainerStyle } = useScrollContentContainerStyle(styles.scrollContent);
  const { t } = useTranslation();
  const goBack = useGoBack();
  const openConfigureLimits = useNavigateToConfigureLimits();
  const { appRows, showUsageRefreshIndicator, refreshUsage } = useTrackedAppRows({ lifecycle: false });
  const { refreshControl, refreshing: isPullRefreshing } = useTrackedAppsRefresh(refreshUsage);
  const appRowsExtraData = useMemo(() => buildAppRowsSnapshotKey(appRows), [appRows]);

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
          extraData={appRowsExtraData}
          renderItem={renderItem}
          keyExtractor={trackedAppKeyExtractor}
          getItemLayout={getTrackedAppListItemLayout}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={TrackedAppsEmpty}
          contentContainerStyle={scrollContentContainerStyle}
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
