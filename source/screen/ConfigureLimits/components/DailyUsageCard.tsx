/** @format */

import React, { Activity, memo } from 'react';
import { Text, View } from 'react-native';

import { useFormatUsage } from '@/hooks/useFormatUsage';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';
import { computeUsageMetrics } from '@/utils/usage/computeUsageMetrics';

import { useConfigureLimitsStyles } from '../styles';

import { ProgressBar } from '@/components';

type DailyUsageCardProps = {
  appKey: string;
  usedMs: number;
  limitMs: number;
};

export const DailyUsageCard = memo(({ appKey, usedMs, limitMs }: DailyUsageCardProps) => {
  const styles = useConfigureLimitsStyles();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { formatUsagePair } = useFormatUsage();
  const { barProgress, isOverLimit } = computeUsageMetrics(usedMs, limitMs);
  const percent = Math.round(barProgress);
  const usageText = formatUsagePair(usedMs, limitMs);

  return (
    <View
      style={styles.dailyUsageCard}
      testID={testIds.configureLimits.dailyUsageCard(appKey)}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={t('configureLimits.usageTodayA11y', { usage: usageText })}
    >
      <Text accessibilityRole="header" style={styles.dailyUsageTitle}>
        {t('configureLimits.usageToday')}
      </Text>
      <Text style={styles.dailyUsageValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
        {usageText}
      </Text>
      <Text style={styles.dailyUsageHint}>{t('configureLimits.usageSubtitle')}</Text>
      <Activity mode={isOverLimit ? 'visible' : 'hidden'}>
        <Text style={styles.dailyUsageOverHint}>{t('configureLimits.overLimitWarning')}</Text>
      </Activity>
      <ProgressBar
        progress={barProgress}
        fillColor={isOverLimit ? colors.overLimit : colors.accent}
        style={styles.dailyUsageProgress}
        accessibilityRole="progressbar"
        accessibilityLabel={t('configureLimits.usageProgressA11y')}
        accessibilityValue={{ min: 0, max: 100, now: percent }}
      />
      <Text style={[styles.dailyUsagePercent, isOverLimit && styles.dailyUsagePercentOver]}>
        {t('format.percentOfLimit', { percent })}
      </Text>
    </View>
  );
});
