/** @format */

import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { testIds } from '@/testing/testIds';

import { dashboardStyles } from '../styles';
import type { DistractingAppRowProps } from '../types';

export const DistractingAppRow = ({ packageName, appImage, appName, onPress }: DistractingAppRowProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`Configure limits for ${appName}`}
    onPress={() => onPress(packageName)}
    style={dashboardStyles.appItem}
    testID={testIds.dashboard.appRow(packageName)}
  >
    <View style={dashboardStyles.appRow}>
      <View style={dashboardStyles.appIconBox}>
        {appImage ? (
          <Image source={{ uri: appImage }} style={dashboardStyles.appIcon} resizeMode="cover" />
        ) : (
          <Text style={dashboardStyles.appIconFallback}>{appName.charAt(0).toUpperCase()}</Text>
        )}
      </View>

      <View style={dashboardStyles.appInfo}>
        <Text style={dashboardStyles.appName} numberOfLines={1}>
          {appName}
        </Text>
      </View>
    </View>
  </Pressable>
);
