/** @format */

import React from 'react';
import { Text } from 'react-native';

import { useThemedStyles } from '@/hooks/useThemedStyles';
import { testIds } from '@/testing/testIds';

import { createDashboardStyles } from '../styles';

export const DistractingAppsListEmpty = () => {
  const styles = useThemedStyles(createDashboardStyles);

  return (
    <Text style={styles.emptyText} testID={testIds.dashboard.appsEmpty}>
      No apps selected yet
    </Text>
  );
};
