/** @format */

import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { useThemedStyles } from '@/hooks/useThemedStyles';

import { createConfigureLimitsStyles } from '../styles';

import { AppIcon } from '@/components';

export type AppLimitsAppBadgeProps = {
  appName: string;
  appImage?: string;
  testID?: string;
};

export const AppLimitsAppBadge = memo(({ appName, appImage, testID }: AppLimitsAppBadgeProps) => {
  const styles = useThemedStyles(createConfigureLimitsStyles);

  return (
    <View style={styles.appBadge} testID={testID}>
      <AppIcon
        appName={appName}
        appImage={appImage}
        size="md"
        boxStyle={styles.appIconBox}
        imageStyle={styles.appIcon}
      />
      <Text style={styles.appName} numberOfLines={1}>
        {appName}
      </Text>
    </View>
  );
});
