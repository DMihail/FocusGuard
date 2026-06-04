/** @format */

import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';

import type { ScrollIndicatorProps } from '../types';
import { createIndicatorProgress } from '../utils';
import { AnimatedIndicatorDot, type IndicatorVariant } from './AnimatedIndicatorDot';

type ScrollIndicatorPropsWithVariant = ScrollIndicatorProps & {
  variant: IndicatorVariant;
};

export const ScrollIndicator = ({ count, scrollX, pageWidth, variant }: ScrollIndicatorPropsWithVariant) => {
  const progressByIndex = useMemo(
    () => Array.from({ length: count }, (_, index) => createIndicatorProgress(scrollX, index, pageWidth)),
    [count, pageWidth, scrollX],
  );

  return (
    <View style={[styles.container, variant === 'page' && styles.containerCentered]}>
      {progressByIndex.map((progress, index) => (
        <AnimatedIndicatorDot key={index} variant={variant} progress={progress} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  containerCentered: {
    justifyContent: 'center',
  },
});
