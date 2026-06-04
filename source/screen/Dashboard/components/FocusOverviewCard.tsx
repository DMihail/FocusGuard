/** @format */

import React from 'react';
import { Text, View } from 'react-native';

import { testIds } from '@/testing/testIds';
import type { DashboardSummary } from '@/utils/usage/dashboardStats';
import { formatUsageMinutes } from '@/utils/usage/formatUsage';

import { dashboardStyles } from '../styles';

import { ProgressBar } from '@/components/ProgressBar';

type FocusOverviewCardProps = {
  summary: DashboardSummary;
};

export const FocusOverviewCard = ({ summary }: FocusOverviewCardProps) => {
  const usedPercent =
    summary.totalAllowedMs > 0 ? Math.min(100, Math.round((summary.totalUsedMs / summary.totalAllowedMs) * 100)) : 0;

  return (
    <View style={dashboardStyles.focusCard} testID={testIds.dashboard.focusOverview}>
      <View style={dashboardStyles.focusCardHeader}>
        <View style={dashboardStyles.focusIconBadge}>
          <Text style={dashboardStyles.focusIconLabel}>◎</Text>
        </View>
        <Text style={dashboardStyles.focusCardLabel}>Focus Score</Text>
      </View>

      <View style={dashboardStyles.focusScoreBlock}>
        <Text style={dashboardStyles.focusScoreValue}>{summary.focusScore}</Text>
        <View style={dashboardStyles.focusBudgetPill}>
          <Text style={dashboardStyles.focusBudgetText}>
            {formatUsageMinutes(summary.remainingMs)} left of {formatUsageMinutes(summary.totalAllowedMs)}
          </Text>
        </View>
      </View>

      <ProgressBar progress={usedPercent} style={dashboardStyles.focusProgress} height={8} />
    </View>
  );
};
