/** @format */

import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

const DOT_PULSE_MIN = 0.35;
const DOT_PULSE_DURATION_MS = 360;
const DOT_STAGGER_MS = 120;

export const splashDotPulseMin = DOT_PULSE_MIN;

/** Drives a sequential pulse across loading dots (one shared loop, native driver). */
export const useSplashDotPulse = (dotCount: number) => {
  const pulseValues = useRef(Array.from({ length: dotCount }, () => new Animated.Value(DOT_PULSE_MIN))).current;

  useEffect(() => {
    const wave = Animated.sequence(
      pulseValues.flatMap((value, index) => {
        const pulseUp = Animated.timing(value, {
          toValue: 1,
          duration: DOT_PULSE_DURATION_MS,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        });
        const pulseDown = Animated.timing(value, {
          toValue: DOT_PULSE_MIN,
          duration: DOT_PULSE_DURATION_MS,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        });

        if (index === 0) {
          return [pulseUp, pulseDown];
        }

        return [Animated.delay(DOT_STAGGER_MS), pulseUp, pulseDown];
      }),
    );

    const loop = Animated.loop(wave);
    loop.start();

    return () => {
      loop.stop();
      pulseValues.forEach((value) => value.stopAnimation());
    };
  }, [pulseValues]);

  return pulseValues;
};
