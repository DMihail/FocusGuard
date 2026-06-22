/** @format */

import React from 'react';
import { Text } from 'react-native';

import { testIds } from '@/testing/testIds';

import { useTrackedAppsStyles } from '../styles';

export const TrackedAppsEmpty = () => {
  const styles = useTrackedAppsStyles();

  return (
    <Text style={styles.emptyText} testID={testIds.trackedApps.empty}>
      No apps are being monitored yet
    </Text>
  );
};
