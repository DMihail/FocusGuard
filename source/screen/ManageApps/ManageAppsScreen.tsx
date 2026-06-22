/** @format */

import React from 'react';

import { useGoBack } from '@/hooks/useGoBack';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { useNavigateToConfigureLimits } from '@/navigation/hooks/useNavigateToConfigureLimits';
import { testIds } from '@/testing/testIds';

import { useManageAppsScreen } from './hooks/useManageAppsScreen';
import { createManageAppsStyles } from './styles';

import { ManageAppsContent, ManageAppsHeader, ManageAppsSearchToolbar } from './components';
import { ScreenSafeArea } from '@/components';

export const ManageAppsScreen = () => {
  const styles = useThemedStyles(createManageAppsStyles);
  const goBack = useGoBack();
  const openConfigureLimits = useNavigateToConfigureLimits();
  const screen = useManageAppsScreen();

  return (
    <ScreenSafeArea style={styles.screen} testID={testIds.manageApps.screen} accessibilityLabel="Manage apps screen">
      <ManageAppsHeader selectedCount={screen.selectedCount} onBack={goBack} />
      {screen.showSearchToolbar ? (
        <ManageAppsSearchToolbar
          onQueryChange={screen.setSearchQuery}
          onQueryActiveChange={screen.setSearchInputActive}
        />
      ) : null}
      <ManageAppsContent
        apps={screen.apps}
        isLoadingApps={screen.isLoadingApps}
        isFiltering={screen.isFiltering}
        selectedApps={screen.selectedApps}
        isSelected={screen.isSelected}
        onToggle={screen.toggleAppSelection}
        onSelectedAppPress={openConfigureLimits}
        onSelectedAppRemove={screen.toggleAppSelection}
        isSearchActive={screen.isSearchActive}
        categoryFilters={screen.categoryFilters}
        activeCategoryId={screen.activeCategoryId}
        onCategoryChange={screen.setActiveCategory}
        showInstalledAppsList={screen.showInstalledAppsList}
        onPickApps={screen.onPickApps}
        isPickingApps={screen.isPickingApps}
      />
    </ScreenSafeArea>
  );
};
