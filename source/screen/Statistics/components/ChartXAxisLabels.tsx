/** @format */

import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { useStatisticsStyles } from '../styles';
import { CHART_Y_AXIS_WIDTH } from '../utils/chartLayout';

type ChartXAxisLabelsProps = {
  labels: string[];
  chartWidth: number;
};

export const ChartXAxisLabels = memo(({ labels, chartWidth }: ChartXAxisLabelsProps) => {
  const styles = useStatisticsStyles();

  return (
    <View style={styles.customXAxisRow}>
      <View style={[styles.customXAxisYAxisSpacer, { width: CHART_Y_AXIS_WIDTH }]} />
      <View style={[styles.customXAxisLabels, { width: chartWidth }]}>
        {labels.map((label, index) => (
          <Text key={`${label}-${index}`} style={styles.customXAxisLabel} numberOfLines={2}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
});

ChartXAxisLabels.displayName = 'ChartXAxisLabels';
