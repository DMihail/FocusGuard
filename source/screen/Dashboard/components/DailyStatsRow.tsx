/** @format */

import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { RemainingSvg, UsedSvg } from '@/assets/svg/Dashboard';
import { testIds } from '@/testing/testIds';
import type { DashboardSummary } from '@/utils/usage/dashboardStats';
import { formatUsageMinutes } from '@/utils/usage/formatUsage';

import { dashboardStyles } from '../styles';

type DailyStatsRowProps = {
  summary: DashboardSummary;
};

const areDailyStatsRowPropsEqual = (previous: DailyStatsRowProps, next: DailyStatsRowProps): boolean =>
  previous.summary.focusScore === next.summary.focusScore &&
  previous.summary.totalUsedMs === next.summary.totalUsedMs &&
  previous.summary.totalAllowedMs === next.summary.totalAllowedMs &&
  previous.summary.remainingMs === next.summary.remainingMs;

export const DailyStatsRow = memo(({ summary }: DailyStatsRowProps) => {
  const usedLabel = `Used today, ${formatUsageMinutes(summary.totalUsedMs)} total`;
  const remainingLabel = `Remaining budget, ${formatUsageMinutes(summary.remainingMs)}`;

  return (
    <View style={dashboardStyles.statsRow} testID={testIds.dashboard.dailyStats}>
      <View style={dashboardStyles.statCard} accessible accessibilityRole="summary" accessibilityLabel={usedLabel}>
        <View style={[dashboardStyles.statIconBadge, dashboardStyles.statIconUsed]} importantForAccessibility="no">
          <UsedSvg />
        </View>
        <Text style={dashboardStyles.statLabel}>Used today</Text>
        <View style={dashboardStyles.statValueBlock}>
          <Text style={dashboardStyles.statValueMain} numberOfLines={1}>
            {formatUsageMinutes(summary.totalUsedMs)}
          </Text>
          <Text style={dashboardStyles.statValueUnit}>total</Text>
        </View>
      </View>

      <View style={dashboardStyles.statCard} accessible accessibilityRole="summary" accessibilityLabel={remainingLabel}>
        <View style={[dashboardStyles.statIconBadge, dashboardStyles.statIconRemaining]} importantForAccessibility="no">
          <RemainingSvg />
        </View>
        <Text style={dashboardStyles.statLabel}>Remaining</Text>
        <View style={dashboardStyles.statValueBlock}>
          <Text style={dashboardStyles.statValueMain} numberOfLines={1}>
            {formatUsageMinutes(summary.remainingMs)}
          </Text>
          <Text style={dashboardStyles.statValueUnit}>budget</Text>
        </View>
      </View>
    </View>
  );
}, areDailyStatsRowPropsEqual);
