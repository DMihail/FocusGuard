/** @format */

import React from 'react';
import { Animated, type Animated as AnimatedNamespace, StyleSheet, View } from 'react-native';

import { borderRadius, colors } from '@/theme';

export type IndicatorVariant = 'progress' | 'page';

const VARIANT_CONFIG = {
  progress: {
    activeWidth: 24,
    inactiveWidth: 8,
    height: 4,
  },
  page: {
    activeWidth: 16,
    inactiveWidth: 8,
    height: 8,
  },
} as const;

type AnimatedIndicatorDotProps = {
  progress: AnimatedNamespace.AnimatedInterpolation<number>;
  variant: IndicatorVariant;
};

export const AnimatedIndicatorDot = ({ progress, variant }: AnimatedIndicatorDotProps) => {
  const config = VARIANT_CONFIG[variant];
  const minScale = config.inactiveWidth / config.activeWidth;

  const scaleX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [minScale, 1],
  });

  const activeOpacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const inactiveOpacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: config.activeWidth,
          height: config.height,
          transform: [{ scaleX }],
        },
      ]}
    >
      <View style={[styles.layer, { backgroundColor: colors.indicatorInactive }]} />
      <Animated.View style={[styles.layer, { backgroundColor: colors.indicatorInactive, opacity: inactiveOpacity }]} />
      <Animated.View style={[styles.layer, { backgroundColor: colors.accent, opacity: activeOpacity }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dot: {
    borderRadius: borderRadius.pill,
    overflow: 'hidden',
  },
  layer: {
    ...(StyleSheet.absoluteFill as object),
    borderRadius: borderRadius.pill,
  },
});
