/** @format */

import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Animated, { interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { Shield } from '@/assets/svg/Onboarding';
import { getAppDisplayName } from '@/constants/appDisplayName';
import { splashDotPulseMin, useSplashDotPulse } from '@/hooks/useSplashDotPulse';
import { testIds } from '@/testing/testIds';
import { borderRadius, colors, fontSize, lineHeight, spacing, typography } from '@/theme';

const SPLASH_DOT_COUNT = 3;
const APP_TAGLINE = 'Reclaim your time, restore your focus';

type SplashPulseDotProps = {
  pulse: SharedValue<number>;
};

const SplashPulseDot = memo(({ pulse }: SplashPulseDotProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
    transform: [
      {
        scale: interpolate(pulse.value, [splashDotPulseMin, 1], [0.85, 1.15]),
      },
    ],
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
});

SplashPulseDot.displayName = 'SplashPulseDot';

const SplashLoadingDots = () => {
  const { isReducedMotion, pulseValues } = useSplashDotPulse(SPLASH_DOT_COUNT);

  if (isReducedMotion) {
    return (
      <View style={styles.dots} accessible={false}>
        {Array.from({ length: SPLASH_DOT_COUNT }, (_, index) => (
          <View key={index} style={styles.dot} />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.dots} accessible={false}>
      {pulseValues.map((pulse, index) => (
        <SplashPulseDot key={index} pulse={pulse} />
      ))}
    </View>
  );
};

export const SplashBranding = memo(() => {
  const appDisplayName = getAppDisplayName();

  return (
    <View
      style={styles.container}
      testID={testIds.app.loader}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Loading ${appDisplayName}`}
      accessibilityState={{ busy: true }}
    >
      <View style={styles.content} importantForAccessibility="no-hide-descendants">
        <View style={styles.iconBox} accessible={false}>
          <Shield width={82} height={101} stroke={colors.accent} />
        </View>

        <Text style={styles.title} accessibilityRole="header">
          {appDisplayName}
        </Text>
        <Text style={styles.subtitle}>{APP_TAGLINE}</Text>

        <SplashLoadingDots />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  content: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  iconBox: {
    width: 208,
    height: 208,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    ...typography.title,
    fontSize: 32,
    lineHeight: 40,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.accent,
  },
});
