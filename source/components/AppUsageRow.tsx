import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getManageAppKey } from '@/domain/appKey';
import { useTheme } from '@/hooks/useTheme';
import { createStylesHook } from '@/hooks/useThemedStyles';
import { testIds } from '@/testing/testIds';
import { fontSize, spacing, typography } from '@/theme';
import type { Theme } from '@/theme/types';
import { computeUsageMetrics } from '@/utils/usage/computeUsageMetrics';
import type { DashboardAppRow } from '@/utils/usage/dashboardStats';
import { formatUsagePair } from '@/utils/usage/formatUsage';

import { AppIcon } from './AppIcon';
import { ProgressBar } from './ProgressBar';

export type AppUsageRowProps = DashboardAppRow & {
  onPress: (appKey: string) => void;
  rowTestID?: string;
};

const createAppUsageRowStyles = ({ colors, presets }: Theme) => {
  const { layoutPresets, textPresets, iconBoxPresets } = presets;

  return StyleSheet.create({
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
};

const useAppUsageRowStyles = createStylesHook(createAppUsageRowStyles);

export const AppUsageRow = memo(({ onPress, rowTestID, ...app }: AppUsageRowProps) => {
  const styles = useAppUsageRowStyles();
  const { colors } = useTheme();
  const appKey = getManageAppKey(app);
  const { appImage, appName, usedMs, limitMs, percentUsed, isOverLimit } = app;
  const { barProgress } = computeUsageMetrics(usedMs, limitMs);
  const fillColor = isOverLimit ? colors.overLimit : colors.accent;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Configure limits for ${appName}, ${percentUsed} percent used`}
      onPress={() => onPress(appKey)}
      style={styles.item}
      testID={rowTestID ?? testIds.dashboard.appRow(appKey)}
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
});
