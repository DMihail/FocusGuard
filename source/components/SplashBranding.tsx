/** @format */

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { Shield } from '@/assets/svg/Onboarding';
import { testIds } from '@/testing/testIds';
import { borderRadius, colors, fontSize, lineHeight, spacing, typography } from '@/theme';

const DOT_COUNT = 3;
const DOT_PULSE_MIN = 0.35;
const DOT_PULSE_DURATION_MS = 360;
const DOT_STAGGER_MS = 120;

const SplashLoadingDots = () => {
  const pulseValues = useRef(Array.from({ length: DOT_COUNT }, () => new Animated.Value(DOT_PULSE_MIN))).current;

  useEffect(() => {
    const loops = pulseValues.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * DOT_STAGGER_MS),
          Animated.timing(value, {
            toValue: 1,
            duration: DOT_PULSE_DURATION_MS,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: DOT_PULSE_MIN,
            duration: DOT_PULSE_DURATION_MS,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay((DOT_COUNT - 1 - index) * DOT_STAGGER_MS),
        ]),
      ),
    );

    const animation = Animated.parallel(loops);
    animation.start();

    return () => {
      animation.stop();
      loops.forEach((loop) => loop.stop());
      pulseValues.forEach((value) => value.stopAnimation());
    };
  }, [pulseValues]);

  return (
    <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {pulseValues.map((value, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              opacity: value,
              transform: [
                {
                  scale: value.interpolate({
                    inputRange: [DOT_PULSE_MIN, 1],
                    outputRange: [0.85, 1.15],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

export const SplashBranding = () => (
  <View style={styles.container} testID={testIds.app.loader} accessibilityLabel="Loading FocusGuard">
    <View style={styles.content}>
      <View style={styles.iconBox}>
        <Shield width={82} height={101} stroke={colors.accent} />
      </View>

      <Text style={styles.title}>FocusGuard</Text>
      <Text style={styles.subtitle}>Reclaim your time, restore your focus</Text>

      <SplashLoadingDots />
    </View>
  </View>
);

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
