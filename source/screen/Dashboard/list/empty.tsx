/** @format */

import React from 'react';
import { Text } from 'react-native';

import { testIds } from '@/testing/testIds';

import { dashboardStyles } from '../styles';

export const DistractingAppsListEmpty = () => (
  <Text style={dashboardStyles.emptyText} testID={testIds.dashboard.appsEmpty}>
    No apps selected yet
  </Text>
);
