/** @format */

import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { useFormatUsage } from '@/hooks/useFormatUsage';
import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';
import type { StatisticsSummary } from '@/utils/usage/statistics';

import { useStatisticsStyles } from '../styles';

type SummaryCardsProps = {
  summary: StatisticsSummary;
};

const areSummaryCardsPropsEqual = (previous: SummaryCardsProps, next: SummaryCardsProps): boolean =>
  previous.summary.focusScore === next.summary.focusScore &&
  previous.summary.savedMs === next.summary.savedMs &&
  previous.summary.streakDays === next.summary.streakDays;

export const SummaryCards = memo(({ summary }: SummaryCardsProps) => {
  const styles = useStatisticsStyles();
  const { t } = useTranslation();
  const { formatUsageMinutes } = useFormatUsage();
  const savedLabel = formatUsageMinutes(summary.savedMs);

  return (
    <View style={styles.summaryRow} testID={testIds.statistics.summaryCards}>
      <View
        style={[styles.summaryCard, styles.summaryCardAccent]}
        accessible
        accessibilityRole="summary"
        accessibilityLabel={t('statistics.focusScoreA11y', { score: summary.focusScore })}
      >
        <Text style={styles.summaryValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
          {summary.focusScore}
        </Text>
        <Text style={styles.summaryLabel}>{t('statistics.focusScore')}</Text>
      </View>

      <View
        style={[styles.summaryCard, styles.summaryCardSuccess]}
        accessible
        accessibilityRole="summary"
        accessibilityLabel={t('statistics.savedA11y', { time: savedLabel })}
      >
        <Text style={styles.summaryValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
          {savedLabel}
        </Text>
        <Text style={styles.summaryLabel}>{t('statistics.saved')}</Text>
      </View>

      <View
        style={[styles.summaryCard, styles.summaryCardWarning]}
        accessible
        accessibilityRole="summary"
        accessibilityLabel={t('statistics.streakA11y', { count: summary.streakDays })}
      >
        <Text style={styles.summaryValue} numberOfLines={1}>
          {summary.streakDays}
        </Text>
        <Text style={styles.summaryLabel}>{t('statistics.streak')}</Text>
      </View>
    </View>
  );
}, areSummaryCardsPropsEqual);

SummaryCards.displayName = 'SummaryCards';
