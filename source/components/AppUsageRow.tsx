import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getManageAppKey } from '@/domain/appKey';
import { createStylesHook } from '@/hooks/createStylesHook';
import { useFormatUsage } from '@/hooks/useFormatUsage';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';
import { fontSize, spacing, typography } from '@/theme';
import type { Theme } from '@/theme/types';
import type { DashboardAppRow } from '@/utils/usage/dashboardStats';

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

const areAppUsageRowPropsEqual = (previous: AppUsageRowProps, next: AppUsageRowProps): boolean =>
  previous.onPress === next.onPress &&
  previous.rowTestID === next.rowTestID &&
  getManageAppKey(previous) === getManageAppKey(next) &&
  previous.usedMs === next.usedMs &&
  previous.limitMs === next.limitMs &&
  previous.percentUsed === next.percentUsed &&
  previous.barProgress === next.barProgress &&
  previous.isOverLimit === next.isOverLimit &&
  previous.appName === next.appName &&
  previous.appImage === next.appImage;

export const AppUsageRow = memo(({ onPress, rowTestID, ...app }: AppUsageRowProps) => {
  const styles = useAppUsageRowStyles();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { formatUsagePair } = useFormatUsage();
  const appKey = getManageAppKey(app);
  const { appImage, appName, usedMs, limitMs, percentUsed, barProgress, isOverLimit } = app;
  const fillColor = isOverLimit ? colors.overLimit : colors.accent;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('appUsage.configureA11y', { appName, percent: percentUsed })}
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
          {t('format.percent', { percent: percentUsed })}
        </Text>
      </View>

      <ProgressBar
        progress={barProgress}
        fillColor={fillColor}
        accessibilityRole="progressbar"
        accessibilityLabel={t('appUsage.usageA11y', { appName })}
        accessibilityValue={{ min: 0, max: 100, now: Math.round(barProgress) }}
      />
    </Pressable>
  );
}, areAppUsageRowPropsEqual);
