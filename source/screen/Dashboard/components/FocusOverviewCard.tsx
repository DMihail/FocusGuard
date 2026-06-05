/** @format */

import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { FocusScoreSvg } from '@/assets/svg/Dashboard';
import { testIds } from '@/testing/testIds';
import type { DashboardSummary } from '@/utils/usage/dashboardStats';
import { formatUsageMinutes } from '@/utils/usage/formatUsage';

import { dashboardStyles } from '../styles';

import { ProgressBar } from '@/components/ProgressBar';

type FocusOverviewCardProps = {
  summary: DashboardSummary;
};

function FocusOverviewCardView({ summary }: FocusOverviewCardProps) {
  const usedPercent =
    summary.totalAllowedMs > 0 ? Math.min(100, Math.round((summary.totalUsedMs / summary.totalAllowedMs) * 100)) : 0;

  const accessibilityLabel = `Focus score ${summary.focusScore}. ${formatUsageMinutes(
    summary.remainingMs,
  )} remaining of ${formatUsageMinutes(summary.totalAllowedMs)} daily budget.`;

  return (
    <View
      style={dashboardStyles.focusCard}
      testID={testIds.dashboard.focusOverview}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={dashboardStyles.focusCardHeader}>
        <View style={dashboardStyles.focusIconBadge} importantForAccessibility="no-hide-descendants">
          <FocusScoreSvg />
        </View>
        <Text style={dashboardStyles.focusCardLabel} accessibilityRole="header">
          Focus Score
        </Text>
      </View>

      <ProgressBar
        progress={usedPercent}
        style={dashboardStyles.focusProgress}
        height={8}
        accessibilityRole="progressbar"
        accessibilityLabel="Daily budget used"
        accessibilityValue={{ min: 0, max: 100, now: usedPercent }}
      />
    </View>
  );
}

export const FocusOverviewCard = memo(FocusOverviewCardView, areFocusOverviewCardPropsEqual);

function areFocusOverviewCardPropsEqual(previous: FocusOverviewCardProps, next: FocusOverviewCardProps): boolean {
  return (
    previous.summary.focusScore === next.summary.focusScore &&
    previous.summary.remainingMs === next.summary.remainingMs &&
    previous.summary.totalAllowedMs === next.summary.totalAllowedMs &&
    previous.summary.totalUsedMs === next.summary.totalUsedMs
  );
}
