/** @format */

import React, { memo } from 'react';
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

  return (
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
          <Text style={dashboardStyles.appUsage}>{formatUsagePair(usedMs, limitMs)}</Text>
        </View>

        <Text style={[dashboardStyles.appPercent, isOverLimit && dashboardStyles.appPercentOver]} numberOfLines={1}>
          {percentUsed}%
        </Text>
      </View>

      <ProgressBar progress={barProgress} fillColor={fillColor} />
    </Pressable>
  );
}

export const DistractingAppRow = memo(DistractingAppRowView);
