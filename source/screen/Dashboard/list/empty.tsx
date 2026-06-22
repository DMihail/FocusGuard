/** @format */

import React from 'react';
import { Text } from 'react-native';

import { testIds } from '@/testing/testIds';

import { useDashboardStyles } from '../styles';

export const DistractingAppsListEmpty = () => {
  const styles = useDashboardStyles();

  return (
    <Text style={styles.emptyText} testID={testIds.dashboard.appsEmpty}>
      No apps selected yet
    </Text>
  );
};
