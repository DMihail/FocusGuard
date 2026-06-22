/** @format */

import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { RemainingSvg, UsedSvg } from '@/assets/svg/Dashboard';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { testIds } from '@/testing/testIds';
import type { DashboardSummary } from '@/utils/usage/dashboardStats';
import { formatUsageMinutes } from '@/utils/usage/formatUsage';

import { createDashboardStyles } from '../styles';

type DailyStatsRowProps = {
  summary: DashboardSummary;
};

const areDailyStatsRowPropsEqual = (previous: DailyStatsRowProps, next: DailyStatsRowProps): boolean =>
  previous.summary.focusScore === next.summary.focusScore &&
  previous.summary.totalUsedMs === next.summary.totalUsedMs &&
  previous.summary.totalAllowedMs === next.summary.totalAllowedMs &&
  previous.summary.remainingMs === next.summary.remainingMs;

export const DailyStatsRow = memo(({ summary }: DailyStatsRowProps) => {
  const styles = useThemedStyles(createDashboardStyles);
  const usedLabel = `Used today, ${formatUsageMinutes(summary.totalUsedMs)} total`;
  const remainingLabel = `Remaining budget, ${formatUsageMinutes(summary.remainingMs)}`;

  return (
    <View style={styles.statsRow} testID={testIds.dashboard.dailyStats}>
      <View style={styles.statCard} accessible accessibilityRole="summary" accessibilityLabel={usedLabel}>
        <View style={[styles.statIconBadge, styles.statIconUsed]} importantForAccessibility="no">
          <UsedSvg />
        </View>
        <Text style={styles.statLabel}>Used today</Text>
        <View style={styles.statValueBlock}>
          <Text style={styles.statValueMain} numberOfLines={1}>
            {formatUsageMinutes(summary.totalUsedMs)}
          </Text>
          <Text style={styles.statValueUnit}>total</Text>
        </View>
      </View>

      <View style={styles.statCard} accessible accessibilityRole="summary" accessibilityLabel={remainingLabel}>
        <View style={[styles.statIconBadge, styles.statIconRemaining]} importantForAccessibility="no">
          <RemainingSvg />
        </View>
        <Text style={styles.statLabel}>Remaining</Text>
        <View style={styles.statValueBlock}>
          <Text style={styles.statValueMain} numberOfLines={1}>
            {formatUsageMinutes(summary.remainingMs)}
          </Text>
          <Text style={styles.statValueUnit}>budget</Text>
        </View>
      </View>
    </View>
  );
}, areDailyStatsRowPropsEqual);
