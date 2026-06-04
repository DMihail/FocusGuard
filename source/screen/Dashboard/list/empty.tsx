/** @format */

import React, { memo } from 'react';
import { Text } from 'react-native';

import { testIds } from '@/testing/testIds';

import { dashboardStyles } from '../styles';

function DistractingAppsListEmptyView() {
  return (
    <Text
      style={dashboardStyles.emptyText}
      testID={testIds.dashboard.appsEmpty}
      accessibilityRole="text"
      accessibilityLiveRegion="polite"
    >
      No apps selected yet
    </Text>
  );
}

export const DistractingAppsListEmpty = memo(DistractingAppsListEmptyView);
