/** @format */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/useTheme';
import { borderRadius } from '@/theme';

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
  scrollX: SharedValue<number>;
  index: number;
  pageWidth: number;
  variant: IndicatorVariant;
};

export const AnimatedIndicatorDot = ({ scrollX, index, pageWidth, variant }: AnimatedIndicatorDotProps) => {
  const { colors } = useTheme();
  const config = VARIANT_CONFIG[variant];
  const minScale = config.inactiveWidth / config.activeWidth;

  const dotProgress = useDerivedValue(() => {
    if (pageWidth <= 0) {
      return index === 0 ? 1 : 0;
    }

    return interpolate(
      scrollX.value,
      [(index - 1) * pageWidth, index * pageWidth, (index + 1) * pageWidth],
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
  });

  const dotStyle = useAnimatedStyle(() => ({
    width: config.activeWidth,
    height: config.height,
    transform: [{ scaleX: interpolate(dotProgress.value, [0, 1], [minScale, 1]) }],
  }));

  const inactiveOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(dotProgress.value, [0, 0.5, 1], [1, 0, 0]),
  }));

  const activeOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(dotProgress.value, [0, 0.5, 1], [0, 0, 1]),
  }));

  return (
    <Animated.View style={[styles.dot, dotStyle]}>
      <View style={[styles.layer, { backgroundColor: colors.indicatorInactive }]} />
      <Animated.View style={[styles.layer, { backgroundColor: colors.indicatorInactive }, inactiveOpacityStyle]} />
      <Animated.View style={[styles.layer, { backgroundColor: colors.accent }, activeOpacityStyle]} />
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
