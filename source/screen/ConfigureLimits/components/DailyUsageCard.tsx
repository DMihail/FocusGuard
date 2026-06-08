/** @format */

import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';
import { computeUsageMetrics } from '@/utils/usage/computeUsageMetrics';
import { formatUsagePair } from '@/utils/usage/formatUsage';

import { configureLimitsStyles as styles } from '../styles';

import { ProgressBar } from '@/components/ProgressBar';

type DailyUsageCardProps = {
  packageName: string;
  usedMs: number;
  limitMs: number;
};

export const DailyUsageCard = memo(({ packageName, usedMs, limitMs }: DailyUsageCardProps) => {
  const { barProgress, isOverLimit } = computeUsageMetrics(usedMs, limitMs);
  const percent = Math.round(barProgress);

  return (
    <View
      style={styles.dailyUsageCard}
      testID={testIds.configureLimits.dailyUsageCard(packageName)}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`Usage today, ${formatUsagePair(usedMs, limitMs)}`}
    >
      <Text accessibilityRole="header" style={styles.dailyUsageTitle}>
        Usage today
      </Text>
      <Text style={styles.dailyUsageValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
        {formatUsagePair(usedMs, limitMs)}
      </Text>
      <Text style={styles.dailyUsageHint}>Daily limit applies until midnight</Text>
      {isOverLimit ? (
        <Text style={styles.dailyUsageOverHint}>
          Already over today&apos;s limit — the app will be blocked on next open while monitoring is on.
        </Text>
      ) : null}
      <ProgressBar
        progress={barProgress}
        fillColor={isOverLimit ? colors.overLimit : colors.accent}
        style={styles.dailyUsageProgress}
        accessibilityRole="progressbar"
        accessibilityLabel="Daily usage progress"
        accessibilityValue={{ min: 0, max: 100, now: percent }}
      />
      <Text style={[styles.dailyUsagePercent, isOverLimit && styles.dailyUsagePercentOver]}>{percent}% of limit</Text>
    </View>
  );
});
