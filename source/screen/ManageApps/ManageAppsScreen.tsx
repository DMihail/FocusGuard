/** @format */

import React, { useCallback } from 'react';
import { Platform } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { useGoBack } from '@/hooks/useGoBack';
import { useNavigateToConfigureLimits } from '@/navigation/hooks/useNavigateToConfigureLimits';
import { testIds } from '@/testing/testIds';

import { useFamilyActivityPicker } from './hooks/useFamilyActivityPicker';
import { useManageApps } from './hooks/useManageApps';
import { manageAppsStyles } from './styles';

import { ManageAppsContent, ManageAppsHeader, ManageAppsSearchToolbar } from './components';
import { ScreenSafeArea } from '@/components';

export const ManageAppsScreen = () => {
  const isIos = Platform.OS === 'ios';
  const goBack = useGoBack();
  const openConfigureLimits = useNavigateToConfigureLimits();
  const { pickApps, isPicking } = useFamilyActivityPicker();
  const {
    apps,
    isLoadingApps,
    refreshInstalledApps,
    isFiltering,
    selectedApps,
    setSearchQuery,
    setSearchInputActive,
    isSearchActive,
    categoryFilters,
    activeCategoryId,
    setActiveCategory,
    isSelected,
    toggleAppSelection,
    selectedCount,
  } = useManageApps();

  const handlePickApps = useCallback(() => {
    pickApps()
      .then(() => refreshInstalledApps(true))
      .catch(() => undefined);
  }, [pickApps, refreshInstalledApps]);

  useFocusEffect(
    useCallback(() => {
      refreshInstalledApps().catch(() => undefined);
    }, [refreshInstalledApps]),
  );

  return (
    <ScreenSafeArea
      style={manageAppsStyles.screen}
      testID={testIds.manageApps.screen}
      accessibilityLabel="Manage apps screen"
    >
      <ManageAppsHeader selectedCount={selectedCount} onBack={goBack} />
      {!isIos ? (
        <ManageAppsSearchToolbar onQueryChange={setSearchQuery} onQueryActiveChange={setSearchInputActive} />
      ) : null}
      <ManageAppsContent
        apps={apps}
        isLoadingApps={isLoadingApps}
        isFiltering={isFiltering}
        selectedApps={selectedApps}
        isSelected={isSelected}
        onToggle={toggleAppSelection}
        onSelectedAppPress={openConfigureLimits}
        onSelectedAppRemove={toggleAppSelection}
        isSearchActive={isSearchActive}
        categoryFilters={categoryFilters}
        activeCategoryId={activeCategoryId}
        onCategoryChange={setActiveCategory}
        showInstalledAppsList={!isIos}
        onPickApps={isIos ? handlePickApps : undefined}
        isPickingApps={isPicking}
      />
    </ScreenSafeArea>
  );
};
