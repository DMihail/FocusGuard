/** @format */

import React, { Activity, memo } from 'react';
import { StyleSheet, View } from 'react-native';

import Animated, { interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { splashDotPulseMin, useSplashDotPulse } from '@/hooks/useSplashDotPulse';
import { borderRadius, spacing } from '@/theme';
import { useSystemTheme } from '@/theme/useSystemTheme';

const DEFAULT_DOT_COUNT = 3;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});

type PulseDotProps = {
  pulse: SharedValue<number>;
  dotStyle: { width: number; height: number; borderRadius: number; backgroundColor: string };
};

const PulseDot = memo(({ pulse, dotStyle }: PulseDotProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
    transform: [
      {
        scale: interpolate(pulse.value, [splashDotPulseMin, 1], [0.85, 1.15]),
      },
    ],
  }));

  return <Animated.View style={[dotStyle, animatedStyle]} />;
});

PulseDot.displayName = 'PulseDot';

type LoadingDotsProps = {
  dotCount?: number;
};

/** Sequential pulsing dots used for splash and lazy-screen loading states. */
export const LoadingDots = memo(({ dotCount = DEFAULT_DOT_COUNT }: LoadingDotsProps) => {
  const { colors } = useSystemTheme();
  const dotStyle = {
    width: 8,
    height: 8,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.accent,
  };
  const { isReducedMotion, pulseValues } = useSplashDotPulse(dotCount);

  return (
    <View accessible={false}>
      <Activity mode={isReducedMotion ? 'hidden' : 'visible'}>
        <View style={styles.row}>
          {pulseValues.map((pulse, index) => (
            <PulseDot key={index} pulse={pulse} dotStyle={dotStyle} />
          ))}
        </View>
      </Activity>
      <Activity mode={isReducedMotion ? 'visible' : 'hidden'}>
        <View style={styles.row}>
          {Array.from({ length: dotCount }, (_, index) => (
            <View key={index} style={dotStyle} />
          ))}
        </View>
      </Activity>
    </View>
  );
});

LoadingDots.displayName = 'LoadingDots';
