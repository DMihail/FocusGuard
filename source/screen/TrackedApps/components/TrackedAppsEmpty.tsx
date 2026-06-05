/** @format */

import React from 'react';
import { Text } from 'react-native';

import { testIds } from '@/testing/testIds';

import { trackedAppsStyles } from '../styles';

export const TrackedAppsEmpty = () => (
  <Text style={trackedAppsStyles.emptyText} testID={testIds.trackedApps.empty}>
    No apps are being monitored yet
  </Text>
);
