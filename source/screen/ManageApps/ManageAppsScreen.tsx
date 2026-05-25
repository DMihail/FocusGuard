/** @format */

import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRootNavigation } from '@/navigation';
import { testIds } from '@/testing/testIds';
import { AppSearchField, CategoryFilters, ManageAppsHeader, ManageAppsList, SelectedAppsSection } from './components';
import { useManageApps } from './hooks/useManageApps';
import { manageAppsStyles } from './styles';

export const ManageAppsScreen = () => {
  const navigation = useRootNavigation();
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

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      refreshInstalledApps();
    }, [refreshInstalledApps]),
  );

  return (
    <SafeAreaView
      style={manageAppsStyles.screen}
      edges={['top', 'bottom']}
      testID={testIds.manageApps.screen}
      accessibilityLabel="Manage apps screen"
    >
      <ManageAppsHeader selectedCount={selectedCount} onBack={handleBack} />
      <ScrollView
        testID={testIds.manageApps.scroll}
        contentContainerStyle={manageAppsStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AppSearchField value={searchQuery} onChangeText={setSearchQuery} />

        {!isSearchActive ? (
          <CategoryFilters
            filters={categoryFilters}
            activeCategoryId={activeCategory.id}
            onCategoryChange={setActiveCategory}
          />
        ) : null}

        <SelectedAppsSection apps={selectedApps} />

        <ManageAppsList apps={apps} isFiltering={isFiltering} isSelected={isSelected} onToggle={toggleAppSelection} />
      </ScrollView>
    </SafeAreaView>
  );
};
