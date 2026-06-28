/** @format */

import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';
import type { StatisticsPeriod } from '@/utils/usage/statistics';

import { useStatisticsStyles } from '../styles';

type PeriodToggleProps = {
  period: StatisticsPeriod;
  onChange: (period: StatisticsPeriod) => void;
};

export const PeriodToggle = memo(({ period, onChange }: PeriodToggleProps) => {
  const styles = useStatisticsStyles();
  const { t } = useTranslation();

  return (
    <View style={styles.periodToggle} testID={testIds.statistics.periodToggle}>
      <Pressable
        testID={testIds.statistics.periodWeek}
        accessibilityRole="button"
        accessibilityState={{ selected: period === 'week' }}
        accessibilityLabel={t('statistics.thisWeek')}
        style={[styles.periodButton, period === 'week' && styles.periodButtonActive]}
        onPress={() => onChange('week')}
      >
        <Text
          style={[styles.periodButtonText, period === 'week' && styles.periodButtonTextActive]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
        >
          {t('statistics.thisWeek')}
        </Text>
      </Pressable>

      <Pressable
        testID={testIds.statistics.periodMonth}
        accessibilityRole="button"
        accessibilityState={{ selected: period === 'month' }}
        accessibilityLabel={t('statistics.thisMonth')}
        style={[styles.periodButton, period === 'month' && styles.periodButtonActive]}
        onPress={() => onChange('month')}
      >
        <Text
          style={[styles.periodButtonText, period === 'month' && styles.periodButtonTextActive]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
        >
          {t('statistics.thisMonth')}
        </Text>
      </Pressable>
    </View>
  );
});

PeriodToggle.displayName = 'PeriodToggle';
