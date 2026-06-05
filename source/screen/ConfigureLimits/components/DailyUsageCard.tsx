/** @format */

import React from 'react';
import { Text, View } from 'react-native';

import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';
import { formatUsagePair } from '@/utils/usage/formatUsage';

import { configureLimitsStyles as styles } from '../styles';

import { ProgressBar } from '@/components/ProgressBar';

type DailyUsageCardProps = {
  packageName: string;
  usedMs: number;
  limitMs: number;
};

export const DailyUsageCard = ({ packageName, usedMs, limitMs }: DailyUsageCardProps) => {
  const percent = limitMs > 0 ? Math.min(100, Math.round((usedMs / limitMs) * 100)) : 0;
  const isOverLimit = limitMs > 0 && usedMs >= limitMs;
  const barProgress = limitMs > 0 ? Math.min(100, (usedMs / limitMs) * 100) : 0;

  return (
    <View style={styles.dailyUsageCard} testID={testIds.configureLimits.dailyUsageCard(packageName)}>
      <Text style={styles.dailyUsageTitle}>Usage today</Text>
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
      />
      <Text style={[styles.dailyUsagePercent, isOverLimit && styles.dailyUsagePercentOver]}>{percent}% of limit</Text>
    </View>
  );
};
