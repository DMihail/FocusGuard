/** @format */

import React, { memo, useMemo } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';

import { BarChart } from 'react-native-gifted-charts';

import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';
import { borderRadius } from '@/theme';
import type { UsageChartPoint } from '@/utils/usage/statistics';

import { useStatisticsStyles } from '../styles';
import { CHART_BAR_HEIGHT, CHART_HIDDEN_X_AXIS_HEIGHT, getStatisticsChartWidth } from '../utils/chartLayout';
import { ChartXAxisLabels } from './ChartXAxisLabels';

type UsageSavedChartProps = {
  points: UsageChartPoint[];
  maxMinutes: number;
};

const areUsageSavedChartPropsEqual = (previous: UsageSavedChartProps, next: UsageSavedChartProps): boolean =>
  previous.maxMinutes === next.maxMinutes &&
  previous.points.length === next.points.length &&
  previous.points.every(
    (point, index) =>
      point.label === next.points[index]?.label &&
      point.usageMinutes === next.points[index]?.usageMinutes &&
      point.savedMinutes === next.points[index]?.savedMinutes,
  );

export const UsageSavedChart = memo(({ points, maxMinutes }: UsageSavedChartProps) => {
  const styles = useStatisticsStyles();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();

  const chartWidth = getStatisticsChartWidth(windowWidth);
  const barWidth = points.length > 4 ? 8 : 12;
  const pairSpacing = 4;

  const barData = useMemo(() => {
    const data: Array<{
      value: number;
      frontColor: string;
      spacing: number;
      barBorderTopLeftRadius: number;
      barBorderTopRightRadius: number;
    }> = [];

    points.forEach((point, index) => {
      data.push({
        value: point.usageMinutes,
        frontColor: colors.danger,
        spacing: pairSpacing,
        barBorderTopLeftRadius: borderRadius.sm,
        barBorderTopRightRadius: borderRadius.sm,
      });
      data.push({
        value: point.savedMinutes,
        frontColor: colors.success,
        spacing: index === points.length - 1 ? 16 : pairSpacing,
        barBorderTopLeftRadius: borderRadius.sm,
        barBorderTopRightRadius: borderRadius.sm,
      });
    });

    return data;
  }, [colors.danger, colors.success, points]);

  const xAxisLabels = useMemo(() => points.map((point) => point.label), [points]);

  return (
    <View
      style={styles.chartCard}
      testID={testIds.statistics.usageChart}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={t('statistics.dailyUsageVsSaved')}
    >
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>{t('statistics.dailyUsageVsSaved')}</Text>
      </View>

      <View style={styles.chartBody}>
        <View style={styles.chartPlot}>
          <BarChart
            data={barData}
            width={chartWidth}
            height={CHART_BAR_HEIGHT}
            barWidth={barWidth}
            maxValue={maxMinutes}
            noOfSections={4}
            yAxisTextStyle={styles.chartAxisText}
            xAxisLabelsHeight={CHART_HIDDEN_X_AXIS_HEIGHT}
            showXAxisIndices={false}
            rulesColor={colors.divider}
            rulesType="dashed"
            dashGap={3}
            dashWidth={3}
            yAxisColor="transparent"
            xAxisColor="transparent"
            backgroundColor="transparent"
            initialSpacing={8}
            endSpacing={12}
            disableScroll
          />
        </View>

        <ChartXAxisLabels labels={xAxisLabels} chartWidth={chartWidth} />
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotUsage]} />
          <Text style={styles.legendText}>{t('statistics.usageTime')}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotSaved]} />
          <Text style={styles.legendText}>{t('statistics.savedTime')}</Text>
        </View>
      </View>
    </View>
  );
}, areUsageSavedChartPropsEqual);

UsageSavedChart.displayName = 'UsageSavedChart';
