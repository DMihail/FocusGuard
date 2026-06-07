/** @format */

import React, { useCallback } from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { useGoBack } from '@/hooks/useGoBack';
import { useNavigateToConfigureLimits } from '@/navigation/hooks/useNavigateToConfigureLimits';
import { testIds } from '@/testing/testIds';

import { useManageApps } from './hooks/useManageApps';
import { manageAppsStyles } from './styles';

import { ManageAppsContent, ManageAppsHeader, ManageAppsSearchToolbar } from './components';
import { ScreenSafeArea } from '@/components';

export const ManageAppsScreen = () => {
  const goBack = useGoBack();
  const openConfigureLimits = useNavigateToConfigureLimits();
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
  } = useManageApps();

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
      <ManageAppsHeader onBack={goBack} />
      <ManageAppsSearchToolbar onQueryChange={setSearchQuery} onQueryActiveChange={setSearchInputActive} />
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
      />
    </ScreenSafeArea>
  );
};
