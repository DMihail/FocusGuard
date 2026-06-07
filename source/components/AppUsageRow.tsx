/** @format */

import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { testIds } from '@/testing/testIds';
import { colors, fontSize, iconBoxPresets, layoutPresets, spacing, textPresets, typography } from '@/theme';
import type { DashboardAppRow } from '@/utils/usage/dashboardStats';
import { formatUsagePair } from '@/utils/usage/formatUsage';

import { AppIcon } from './AppIcon';
import { ProgressBar } from './ProgressBar';

export type AppUsageRowProps = DashboardAppRow & {
  onPress: (packageName: string) => void;
  rowTestID?: string;
};

export const AppUsageRow = memo(
  ({
    packageName,
    appImage,
    appName,
    usedMs,
    limitMs,
    percentUsed,
    isOverLimit,
    onPress,
    rowTestID,
  }: AppUsageRowProps) => {
    const barProgress = limitMs > 0 ? Math.min(100, (usedMs / limitMs) * 100) : 0;
    const fillColor = isOverLimit ? colors.overLimit : colors.accent;

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Configure limits for ${appName}, ${percentUsed} percent used`}
        onPress={() => onPress(packageName)}
        style={styles.item}
        testID={rowTestID ?? testIds.dashboard.appRow(packageName)}
      >
        <View style={styles.row}>
          <AppIcon
            appName={appName}
            appImage={appImage}
            size="sm"
            boxStyle={styles.iconBox}
            imageStyle={styles.icon}
            fallbackStyle={styles.iconFallback}
          />

          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {appName}
            </Text>
            <Text style={styles.usage}>{formatUsagePair(usedMs, limitMs)}</Text>
          </View>

          <Text style={[styles.percent, isOverLimit && styles.percentOver]} numberOfLines={1}>
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
  },
  areAppUsageRowPropsEqual,
);

function areAppUsageRowPropsEqual(previous: AppUsageRowProps, next: AppUsageRowProps): boolean {
  return (
    previous.packageName === next.packageName &&
    previous.appName === next.appName &&
    previous.appImage === next.appImage &&
    previous.usedMs === next.usedMs &&
    previous.limitMs === next.limitMs &&
    previous.percentUsed === next.percentUsed &&
    previous.isOverLimit === next.isOverLimit &&
    previous.onPress === next.onPress &&
    previous.rowTestID === next.rowTestID
  );
}

const styles = StyleSheet.create({
  item: {
    gap: spacing.sm,
  },
  row: {
    ...layoutPresets.rowCenter,
    gap: spacing.md,
    minWidth: 0,
  },
  iconBox: iconBoxPresets.sm,
  icon: {
    width: 40,
    height: 40,
  },
  iconFallback: textPresets.label,
  info: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs / 2,
  },
  name: textPresets.label,
  usage: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },
  percent: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.5,
    flexShrink: 0,
    minWidth: 36,
    textAlign: 'right',
  },
  percentOver: {
    color: colors.overLimit,
  },
});
