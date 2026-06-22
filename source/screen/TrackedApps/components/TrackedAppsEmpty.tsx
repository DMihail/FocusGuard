/** @format */

import React from 'react';
import { Text } from 'react-native';

import { useThemedStyles } from '@/hooks/useThemedStyles';
import { testIds } from '@/testing/testIds';

import { createTrackedAppsStyles } from '../styles';

export const TrackedAppsEmpty = () => {
  const styles = useThemedStyles(createTrackedAppsStyles);

  return (
    <Text style={styles.emptyText} testID={testIds.trackedApps.empty}>
      No apps are being monitored yet
    </Text>
  );
};
