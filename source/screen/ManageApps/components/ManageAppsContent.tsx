import React, { Activity, useMemo } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { getManageAppKey } from '@/domain/appKey';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/i18n';
import { APP_LIST_FLAT_LIST_PROPS } from '@/list';
import { keyByManageApp as manageAppKeyExtractor } from '@/list/keys';
import { testIds } from '@/testing/testIds';

import { ManageAppsListEmpty } from '../list/empty';
import { getManageAppListItemLayout } from '../list/layout';
import { createManageAppListRenderItem } from '../list/renderers';
import { useManageAppsStyles } from '../styles';
import type { ManageAppsContentProps } from '../types';
import { IosPickAppsButton } from './IosPickAppsButton';
import { ManageAppsListHeader } from './ManageAppsListHeader';

const createSelectionFingerprint = (selectedApps: ManageAppsContentProps['selectedApps']): string =>
  selectedApps
    .map((app) => getManageAppKey(app))
    .sort()
    .join('\0');

export const ManageAppsContent = ({
  apps,
  isLoadingApps,
  isFiltering,
  selectedApps,
  isSelected,
  onToggle,
  onSelectedAppPress,
  onSelectedAppRemove,
  isSearchActive,
  categoryFilters,
  activeCategoryId,
  onCategoryChange,
  showInstalledAppsList = true,
  onPickApps,
  isPickingApps = false,
}: ManageAppsContentProps) => {
  const styles = useManageAppsStyles();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const renderItem = useMemo(() => createManageAppListRenderItem(isSelected, onToggle), [isSelected, onToggle]);
  const listExtraData = useMemo(() => createSelectionFingerprint(selectedApps), [selectedApps]);

  const listHeader = useMemo(
    () => (
      <>
        {onPickApps ? <IosPickAppsButton isPicking={isPickingApps} onPress={onPickApps} /> : null}
        <ManageAppsListHeader
          selectedApps={selectedApps}
          onSelectedAppPress={onSelectedAppPress}
          onSelectedAppRemove={onSelectedAppRemove}
          isSearchActive={isSearchActive}
          categoryFilters={categoryFilters}
          activeCategoryId={activeCategoryId}
          onCategoryChange={onCategoryChange}
          showCategoryFilters={showInstalledAppsList}
        />
      </>
    ),
    [
      activeCategoryId,
      categoryFilters,
      isPickingApps,
      isSearchActive,
      onCategoryChange,
      onPickApps,
      onSelectedAppPress,
      onSelectedAppRemove,
      selectedApps,
      showInstalledAppsList,
    ],
  );

  const listEmpty = useMemo(() => <ManageAppsListEmpty isFiltering={isFiltering} />, [isFiltering]);

  if (!showInstalledAppsList) {
    return (
      <View style={styles.content} testID={testIds.manageApps.appsList}>
        {listHeader}
      </View>
    );
  }

  return (
    <View style={styles.content} testID={testIds.manageApps.appsList}>
      <View
        style={[styles.listWrapper, (isFiltering || isLoadingApps) && styles.contentDimmed]}
        accessibilityState={isFiltering || isLoadingApps ? { busy: true } : undefined}
      >
        <Activity mode={isFiltering || isLoadingApps ? 'visible' : 'hidden'}>
          <View style={styles.filterLoader} pointerEvents="none">
            <ActivityIndicator
              size="small"
              color={colors.accent}
              accessibilityLabel={isLoadingApps ? t('manageApps.loadingApps') : t('manageApps.filteringApps')}
              testID={isLoadingApps ? testIds.manageApps.appsLoader : testIds.manageApps.appsFilterLoader}
            />
          </View>
        </Activity>

        <FlatList
          style={styles.flatList}
          testID={testIds.manageApps.scroll}
          data={apps}
          extraData={listExtraData}
          renderItem={renderItem}
          keyExtractor={manageAppKeyExtractor}
          getItemLayout={getManageAppListItemLayout}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={listEmpty}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="none"
          accessibilityRole="list"
          accessibilityLabel={t('manageApps.installedAppsA11y')}
          {...APP_LIST_FLAT_LIST_PROPS}
        />
      </View>
    </View>
  );
};
