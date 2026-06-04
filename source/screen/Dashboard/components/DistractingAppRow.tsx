/** @format */

import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { testIds } from '@/testing/testIds';

import { dashboardStyles } from '../styles';
import type { DistractingAppRowProps } from '../types';

import { AppIcon } from '@/components';

export const DistractingAppRow = memo(({ packageName, appImage, appName, onPress }: DistractingAppRowProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`Configure limits for ${appName}`}
    onPress={() => onPress(packageName)}
    style={dashboardStyles.appItem}
    testID={testIds.dashboard.appRow(packageName)}
  >
    <View style={dashboardStyles.appRow}>
      <AppIcon
        appName={appName}
        appImage={appImage}
        size="sm"
        boxStyle={dashboardStyles.appIconBox}
        imageStyle={dashboardStyles.appIcon}
        fallbackStyle={dashboardStyles.appIconFallback}
      />

      <View style={dashboardStyles.appInfo}>
        <Text style={dashboardStyles.appName} numberOfLines={1}>
          {appName}
        </Text>
      </View>
    </View>
  </Pressable>
));

DistractingAppRow.displayName = 'DistractingAppRow';
