/** @format */

import React, { useCallback } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGoBack } from '@/hooks/useGoBack';
import { useNavigateToConfigureLimits } from '@/navigation/hooks/useNavigateToConfigureLimits';
import { testIds } from '@/testing/testIds';

import { useManageApps } from './hooks/useManageApps';
import { manageAppsStyles } from './styles';

import { ManageAppsHeader, ManageAppsList } from './components';
import { ManageAppsListHeader } from './components/ManageAppsListHeader';

export const ManageAppsScreen = () => {
  const goBack = useGoBack();
  const openConfigureLimits = useNavigateToConfigureLimits();
  const {
    apps,
    refreshInstalledApps,
    isFiltering,
    selectedApps,
    selectedCount,
    searchQuery,
    setSearchQuery,
    isSearchActive,
    categoryFilters,
    activeCategory,
    setActiveCategory,
    isSelected,
    toggleAppSelection,
  } = useManageApps();

  useFocusEffect(
    useCallback(() => {
      refreshInstalledApps();
    }, [refreshInstalledApps]),
  );

  const renderListHeader = () => (
    <ManageAppsListHeader
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      isSearchActive={isSearchActive}
      categoryFilters={categoryFilters}
      activeCategoryId={activeCategory.id}
      onCategoryChange={setActiveCategory}
      selectedApps={selectedApps}
      onSelectedAppPress={openConfigureLimits}
    />
  );

  return (
    <SafeAreaView
      style={manageAppsStyles.screen}
      edges={['top', 'bottom']}
      testID={testIds.manageApps.screen}
      accessibilityLabel="Manage apps screen"
    >
      <ManageAppsHeader selectedCount={selectedCount} onBack={goBack} />
      <ManageAppsList
        apps={apps}
        isFiltering={isFiltering}
        selectedCount={selectedCount}
        isSelected={isSelected}
        onToggle={toggleAppSelection}
        ListHeaderComponent={renderListHeader}
      />
    </SafeAreaView>
  );
};
