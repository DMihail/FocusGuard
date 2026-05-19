/** @format */

import React from 'react';
import { Animated, StyleSheet, type Animated as AnimatedNamespace } from 'react-native';
import { colors } from '../../../theme';

export type IndicatorVariant = 'progress' | 'page';

const VARIANT_CONFIG = {
  progress: {
    inactiveWidth: 8,
    activeWidth: 24,
    height: 4,
  },
  page: {
    inactiveWidth: 8,
    activeWidth: 16,
    height: 8,
  },
} as const;

type AnimatedIndicatorDotProps = {
  progress: AnimatedNamespace.AnimatedInterpolation<number>;
  variant: IndicatorVariant;
};

export const AnimatedIndicatorDot = ({ progress, variant }: AnimatedIndicatorDotProps) => {
  const config = VARIANT_CONFIG[variant];

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [config.inactiveWidth, config.activeWidth],
  });

  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.indicatorInactive, colors.accent],
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width,
          height: config.height,
          backgroundColor,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dot: {
    borderRadius: 999,
  },
});
