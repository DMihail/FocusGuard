/** @format */

import React, { memo, useMemo } from 'react';
import { Text, View } from 'react-native';

import { LineChart } from 'react-native-gifted-charts';

import { useContentLayout } from '@/hooks/useContentLayout';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';
import type { FocusTrendPoint } from '@/utils/usage/statistics';

import { useStatisticsStyles } from '../styles';
import { CHART_HIDDEN_X_AXIS_HEIGHT, CHART_LINE_HEIGHT, getStatisticsChartWidth } from '../utils/chartLayout';
import { ChartXAxisLabels } from './ChartXAxisLabels';

type FocusScoreTrendChartProps = {
  points: FocusTrendPoint[];
};

const areFocusScoreTrendChartPropsEqual = (
  previous: FocusScoreTrendChartProps,
  next: FocusScoreTrendChartProps,
): boolean =>
  previous.points.length === next.points.length &&
  previous.points.every(
    (point, index) => point.label === next.points[index]?.label && point.focusScore === next.points[index]?.focusScore,
  );

export const FocusScoreTrendChart = memo(({ points }: FocusScoreTrendChartProps) => {
  const styles = useStatisticsStyles();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { innerWidth } = useContentLayout();

  const chartWidth = getStatisticsChartWidth(innerWidth);

  const lineData = useMemo(
    () =>
      points.map((point) => ({
        value: Math.min(100, Math.max(0, point.focusScore)),
        dataPointColor: colors.accent,
      })),
    [colors.accent, points],
  );

  const xAxisLabels = useMemo(() => points.map((point) => point.label), [points]);

  return (
    <View
      style={styles.chartCard}
      testID={testIds.statistics.focusTrendChart}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={t('statistics.focusScoreTrend')}
    >
      <Text style={styles.chartTitle}>{t('statistics.focusScoreTrend')}</Text>

      <View style={styles.chartBody}>
        <View style={styles.chartPlot}>
          <LineChart
            data={lineData}
            width={chartWidth}
            height={CHART_LINE_HEIGHT}
            maxValue={100}
            mostNegativeValue={0}
            noOfSections={4}
            color={colors.accent}
            thickness={3}
            dataPointsColor={colors.accent}
            dataPointsRadius={4}
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
            initialSpacing={12}
            endSpacing={12}
            overflowTop={8}
            disableScroll
          />
        </View>

        <ChartXAxisLabels labels={xAxisLabels} chartWidth={chartWidth} />
      </View>
    </View>
  );
}, areFocusScoreTrendChartPropsEqual);

FocusScoreTrendChart.displayName = 'FocusScoreTrendChart';
