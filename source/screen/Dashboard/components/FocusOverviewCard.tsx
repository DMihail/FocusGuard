/** @format */

import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { FocusScoreSvg } from '@/assets/svg/Dashboard';
import { useFormatUsage } from '@/hooks/useFormatUsage';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';
import type { DashboardSummary } from '@/utils/usage/dashboardStats';

import { useDashboardStyles } from '../styles';

import { ProgressBar } from '@/components/ProgressBar';

type FocusOverviewCardProps = {
  summary: DashboardSummary;
};

const areFocusOverviewCardPropsEqual = (previous: FocusOverviewCardProps, next: FocusOverviewCardProps): boolean =>
  previous.summary.focusScore === next.summary.focusScore &&
  previous.summary.totalUsedMs === next.summary.totalUsedMs &&
  previous.summary.totalAllowedMs === next.summary.totalAllowedMs &&
  previous.summary.remainingMs === next.summary.remainingMs;

export const FocusOverviewCard = memo(({ summary }: FocusOverviewCardProps) => {
  const styles = useDashboardStyles();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { formatUsageMinutes } = useFormatUsage();
  const usedPercent =
    summary.totalAllowedMs > 0 ? Math.min(100, Math.round((summary.totalUsedMs / summary.totalAllowedMs) * 100)) : 0;

  const accessibilityLabel = t('dashboard.focusScoreA11y', {
    score: summary.focusScore,
    remaining: formatUsageMinutes(summary.remainingMs),
    budget: formatUsageMinutes(summary.totalAllowedMs),
  });

  return (
    <View
      style={styles.focusCard}
      testID={testIds.dashboard.focusOverview}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.focusCardHeader}>
        <View style={styles.focusIconBadge} importantForAccessibility="no-hide-descendants">
          <FocusScoreSvg stroke={colors.onSurface} />
        </View>
        <Text style={styles.focusCardLabel} accessibilityRole="header">
          {t('dashboard.focusScore')}
        </Text>
      </View>

      <ProgressBar
        progress={usedPercent}
        style={styles.focusProgress}
        height={8}
        accessibilityRole="progressbar"
        accessibilityLabel={t('dashboard.dailyBudgetUsed')}
        accessibilityValue={{ min: 0, max: 100, now: usedPercent }}
      />
    </View>
  );
}, areFocusOverviewCardPropsEqual);
