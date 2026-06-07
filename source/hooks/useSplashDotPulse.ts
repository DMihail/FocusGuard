/** @format */

import { useEffect, useRef } from 'react';

import {
  cancelAnimation,
  Easing,
  makeMutable,
  type SharedValue,
  useReducedMotion,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const DOT_PULSE_MIN = 0.35;
const DOT_PULSE_DURATION_MS = 360;
const DOT_STAGGER_MS = 120;

export const splashDotPulseMin = DOT_PULSE_MIN;

const pulseTimingConfig = {
  duration: DOT_PULSE_DURATION_MS,
  easing: Easing.inOut(Easing.ease),
};

type SplashDotPulseResult = {
  isReducedMotion: boolean;
  pulseValues: SharedValue<number>[];
};

/** Drives a sequential pulse across loading dots on the UI thread. */
export const useSplashDotPulse = (dotCount: number): SplashDotPulseResult => {
  const isReducedMotion = useReducedMotion();
  const pulseValues = useRef<SharedValue<number>[] | null>(null);

  if (pulseValues.current === null || pulseValues.current.length !== dotCount) {
    pulseValues.current = Array.from({ length: dotCount }, () => makeMutable(DOT_PULSE_MIN));
  }

  useEffect(() => {
    if (isReducedMotion) {
      return undefined;
    }

    const values = pulseValues.current ?? [];

    values.forEach((value, index) => {
      const pulseCycle = withSequence(withTiming(1, pulseTimingConfig), withTiming(DOT_PULSE_MIN, pulseTimingConfig));

      value.value =
        index === 0 ? withRepeat(pulseCycle, -1) : withDelay(index * DOT_STAGGER_MS, withRepeat(pulseCycle, -1));
    });

    return () => {
      values.forEach((value) => {
        cancelAnimation(value);
        value.value = DOT_PULSE_MIN;
      });
    };
  }, [dotCount, isReducedMotion]);

  return {
    isReducedMotion,
    pulseValues: pulseValues.current ?? [],
  };
};
