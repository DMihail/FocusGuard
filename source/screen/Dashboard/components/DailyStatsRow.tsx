/** @format */

import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { RemainingSvg, UsedSvg } from '@/assets/svg/Dashboard';
import { useFormatUsage } from '@/hooks/useFormatUsage';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';
import type { DashboardSummary } from '@/utils/usage/dashboardStats';

import { useDashboardStyles } from '../styles';

type DailyStatsRowProps = {
  summary: DashboardSummary;
};

const areDailyStatsRowPropsEqual = (previous: DailyStatsRowProps, next: DailyStatsRowProps): boolean =>
  previous.summary.focusScore === next.summary.focusScore &&
  previous.summary.totalUsedMs === next.summary.totalUsedMs &&
  previous.summary.totalAllowedMs === next.summary.totalAllowedMs &&
  previous.summary.remainingMs === next.summary.remainingMs;

export const DailyStatsRow = memo(({ summary }: DailyStatsRowProps) => {
  const styles = useDashboardStyles();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { formatUsageMinutes } = useFormatUsage();
  const usedLabel = t('dashboard.usedTodayA11y', { time: formatUsageMinutes(summary.totalUsedMs) });
  const remainingLabel = t('dashboard.remainingA11y', { time: formatUsageMinutes(summary.remainingMs) });

  return (
    <View style={styles.statsRow} testID={testIds.dashboard.dailyStats}>
      <View style={styles.statCard} accessible accessibilityRole="summary" accessibilityLabel={usedLabel}>
        <View style={[styles.statIconBadge, styles.statIconUsed]} importantForAccessibility="no">
          <UsedSvg stroke={colors.success} />
        </View>
        <Text style={styles.statLabel}>{t('dashboard.usedToday')}</Text>
        <View style={styles.statValueBlock}>
          <Text style={styles.statValueMain} numberOfLines={1}>
            {formatUsageMinutes(summary.totalUsedMs)}
          </Text>
          <Text style={styles.statValueUnit}>{t('common.total')}</Text>
        </View>
      </View>

      <View style={styles.statCard} accessible accessibilityRole="summary" accessibilityLabel={remainingLabel}>
        <View style={[styles.statIconBadge, styles.statIconRemaining]} importantForAccessibility="no">
          <RemainingSvg stroke={colors.warning} />
        </View>
        <Text style={styles.statLabel}>{t('dashboard.remaining')}</Text>
        <View style={styles.statValueBlock}>
          <Text style={styles.statValueMain} numberOfLines={1}>
            {formatUsageMinutes(summary.remainingMs)}
          </Text>
          <Text style={styles.statValueUnit}>{t('common.budget')}</Text>
        </View>
      </View>
    </View>
  );
}, areDailyStatsRowPropsEqual);
