/** @format */

import React, { Activity, memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Animated, { interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { Shield } from '@/assets/svg/Onboarding';
import { getAppDisplayName } from '@/constants/appDisplayName';
import { splashDotPulseMin, useSplashDotPulse } from '@/hooks/useSplashDotPulse';
import { useTheme } from '@/hooks/useTheme';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { testIds } from '@/testing/testIds';
import { borderRadius, fontSize, lineHeight, spacing, typography } from '@/theme';
import type { Theme } from '@/theme/types';

const SPLASH_DOT_COUNT = 3;
const APP_TAGLINE = 'Reclaim your time, restore your focus';

const createSplashBrandingStyles = ({ colors }: Theme) =>
  StyleSheet.create({
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
      marginTop: spacing.md,
    },
    dotsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: borderRadius.pill,
      backgroundColor: colors.accent,
    },
  });

type SplashPulseDotProps = {
  pulse: SharedValue<number>;
  dotStyle: { width: number; height: number; borderRadius: number; backgroundColor: string };
};

const SplashPulseDot = memo(({ pulse, dotStyle }: SplashPulseDotProps) => {
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

SplashPulseDot.displayName = 'SplashPulseDot';

const SplashLoadingDots = ({ dotStyle }: { dotStyle: SplashPulseDotProps['dotStyle'] }) => {
  const { isReducedMotion, pulseValues } = useSplashDotPulse(SPLASH_DOT_COUNT);

  return (
    <View accessible={false}>
      <Activity mode={isReducedMotion ? 'hidden' : 'visible'}>
        <View style={styles.dotsRow}>
          {pulseValues.map((pulse, index) => (
            <SplashPulseDot key={index} pulse={pulse} dotStyle={dotStyle} />
          ))}
        </View>
      </Activity>
      <Activity mode={isReducedMotion ? 'visible' : 'hidden'}>
        <View style={styles.dotsRow}>
          {Array.from({ length: SPLASH_DOT_COUNT }, (_, index) => (
            <View key={index} style={dotStyle} />
          ))}
        </View>
      </Activity>
    </View>
  );
};

const styles = StyleSheet.create({
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});

export const SplashBranding = memo(() => {
  const themedStyles = useThemedStyles(createSplashBrandingStyles);
  const { colors } = useTheme();
  const appDisplayName = getAppDisplayName();

  return (
    <View
      style={themedStyles.container}
      testID={testIds.app.loader}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Loading ${appDisplayName}`}
      accessibilityState={{ busy: true }}
    >
      <View style={themedStyles.content} importantForAccessibility="no-hide-descendants">
        <View style={themedStyles.iconBox} accessible={false}>
          <Shield width={82} height={101} stroke={colors.accent} />
        </View>

        <Text style={themedStyles.title} accessibilityRole="header">
          {appDisplayName}
        </Text>
        <Text style={themedStyles.subtitle}>{APP_TAGLINE}</Text>

        <View style={themedStyles.dots}>
          <SplashLoadingDots dotStyle={themedStyles.dot} />
        </View>
      </View>
    </View>
  );
});
