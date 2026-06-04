/** @format */

import React from 'react';
import { Text, View } from 'react-native';

import { testIds } from '@/testing/testIds';
import type { DashboardSummary } from '@/utils/usage/dashboardStats';
import { formatUsageMinutes } from '@/utils/usage/formatUsage';

import { dashboardStyles } from '../styles';

type DailyStatsRowProps = {
  summary: DashboardSummary;
};

export const DailyStatsRow = ({ summary }: DailyStatsRowProps) => (
  <View style={dashboardStyles.statsRow} testID={testIds.dashboard.dailyStats}>
    <View style={dashboardStyles.statCard}>
      <View style={[dashboardStyles.statIconBadge, dashboardStyles.statIconUsed]}>
        <Text style={dashboardStyles.statIconEmoji}>⏱</Text>
      </View>
      <Text style={dashboardStyles.statLabel}>Used today</Text>
      <View style={dashboardStyles.statValueBlock}>
        <Text style={dashboardStyles.statValueMain} numberOfLines={1}>
          {formatUsageMinutes(summary.totalUsedMs)}
        </Text>
        <Text style={dashboardStyles.statValueUnit}>total</Text>
      </View>
    </View>

    <View style={dashboardStyles.statCard}>
      <View style={[dashboardStyles.statIconBadge, dashboardStyles.statIconRemaining]}>
        <Text style={dashboardStyles.statIconEmoji}>🛡</Text>
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
