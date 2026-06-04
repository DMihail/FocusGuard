/** @format */

import React from 'react';
import { Text, View } from 'react-native';

import { configureLimitsStyles as styles } from '../styles';

import { AppIcon } from '@/components';

export type AppLimitsAppBadgeProps = {
  appName: string;
  appImage?: string;
  testID?: string;
};

export const AppLimitsAppBadge = ({ appName, appImage, testID }: AppLimitsAppBadgeProps) => (
  <View style={styles.appBadge} testID={testID}>
    <AppIcon appName={appName} appImage={appImage} size="md" boxStyle={styles.appIconBox} imageStyle={styles.appIcon} />
    <Text style={styles.appName} numberOfLines={1}>
      {appName}
    </Text>
  </View>
);
