/** @format */

import React, { memo, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';

import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';
import { formatUsagePair } from '@/utils/usage/formatUsage';

import { dashboardStyles } from '../styles';
import type { DistractingAppRowProps } from '../types';

import { AppIcon } from '@/components';
import { ProgressBar } from '@/components/ProgressBar';

function DistractingAppRowView({
  packageName,
  appImage,
  appName,
  usedMs,
  limitMs,
  percentUsed,
  isOverLimit,
  onPress,
}: DistractingAppRowProps) {
  const barProgress = limitMs > 0 ? Math.min(100, (usedMs / limitMs) * 100) : 0;
  const fillColor = isOverLimit ? colors.overLimit : colors.accent;
  const handlePress = useCallback(() => onPress(packageName), [onPress, packageName]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Configure limits for ${appName}, ${percentUsed} percent used`}
      accessibilityHint="Opens daily limit settings"
      onPress={handlePress}
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
          <Text style={dashboardStyles.appUsage}>{formatUsagePair(usedMs, limitMs)}</Text>
        </View>

        <Text style={[dashboardStyles.appPercent, isOverLimit && dashboardStyles.appPercentOver]} numberOfLines={1}>
          {percentUsed}%
        </Text>
      </View>

      <ProgressBar
        progress={barProgress}
        fillColor={fillColor}
        accessibilityRole="progressbar"
        accessibilityLabel={`${appName} daily usage`}
        accessibilityValue={{ min: 0, max: 100, now: Math.round(barProgress) }}
      />
    </Pressable>
  );
}

export const DistractingAppRow = memo(DistractingAppRowView, areDistractingAppRowPropsEqual);

function areDistractingAppRowPropsEqual(previous: DistractingAppRowProps, next: DistractingAppRowProps): boolean {
  return (
    previous.packageName === next.packageName &&
    previous.appName === next.appName &&
    previous.appImage === next.appImage &&
    previous.usedMs === next.usedMs &&
    previous.limitMs === next.limitMs &&
    previous.percentUsed === next.percentUsed &&
    previous.isOverLimit === next.isOverLimit &&
    previous.onPress === next.onPress
  );
}
