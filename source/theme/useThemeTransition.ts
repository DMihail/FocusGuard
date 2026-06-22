/** @format */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { ColorSchemeName } from 'react-native';
import {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { suppressLayoutAnimation } from '@/utils/layoutAnimation';

import { createPresets } from './createPresets';
import { createTheme } from './createTheme';
import { areColorPalettesEqual } from './interpolateColorPalette';
import { interpolateColorPalette } from './interpolateColorPalette';
import type { Theme, ThemePreference } from './types';

const THEME_TRANSITION_MS = 380;

type ThemeTransitionResult = {
  theme: Theme;
  isTransitioning: boolean;
};

export const useThemeTransition = (
  preference: ThemePreference,
  systemScheme: ColorSchemeName | null | undefined,
): ThemeTransitionResult => {
  const targetTheme = useMemo(() => createTheme(preference, systemScheme), [preference, systemScheme]);
  const [displayTheme, setDisplayTheme] = useState(targetTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const displayThemeRef = useRef(targetTheme);
  const fromThemeRef = useRef(targetTheme);
  const targetThemeRef = useRef(targetTheme);
  const progress = useSharedValue(1);
  const reduceMotion = useReducedMotion();
  const hasMountedRef = useRef(false);

  targetThemeRef.current = targetTheme;

  const finishTransition = useCallback(() => {
    const nextTheme = targetThemeRef.current;
    displayThemeRef.current = nextTheme;
    fromThemeRef.current = nextTheme;
    setDisplayTheme(nextTheme);
    setIsTransitioning(false);
  }, []);

  const applyBlendedTheme = useCallback((progressValue: number) => {
    if (progressValue <= 0) {
      return;
    }

    const from = fromThemeRef.current;
    const to = targetThemeRef.current;
    const colors = interpolateColorPalette(from.colors, to.colors, progressValue);
    const blendedPresets = createPresets(colors);
    const nextTheme: Theme = {
      ...to,
      colors,
      presets: {
        ...blendedPresets,
        switchTrackColors: to.presets.switchTrackColors,
        switchThumbColor: to.presets.switchThumbColor,
      },
      colorScheme: to.colorScheme,
      isDark: to.isDark,
    };

    displayThemeRef.current = nextTheme;
    setDisplayTheme(nextTheme);
  }, []);

  useAnimatedReaction(
    () => progress.value,
    (value, previous) => {
      if (previous === null || value === previous) {
        return;
      }

      if (value >= 1) {
        runOnJS(finishTransition)();
        return;
      }

      runOnJS(applyBlendedTheme)(value);
    },
  );

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      displayThemeRef.current = targetTheme;
      fromThemeRef.current = targetTheme;
      setDisplayTheme(targetTheme);
      return;
    }

    const currentTheme = displayThemeRef.current;

    if (areColorPalettesEqual(currentTheme.colors, targetTheme.colors)) {
      displayThemeRef.current = targetTheme;
      fromThemeRef.current = targetTheme;
      setDisplayTheme(targetTheme);
      setIsTransitioning(false);
      progress.value = 1;
      return;
    }

    suppressLayoutAnimation();
    fromThemeRef.current = currentTheme;
    setIsTransitioning(true);

    const semanticTheme: Theme = {
      ...currentTheme,
      colorScheme: targetTheme.colorScheme,
      isDark: targetTheme.isDark,
      preference: targetTheme.preference,
      presets: {
        ...currentTheme.presets,
        switchTrackColors: targetTheme.presets.switchTrackColors,
        switchThumbColor: targetTheme.presets.switchThumbColor,
      },
    };
    displayThemeRef.current = semanticTheme;
    setDisplayTheme(semanticTheme);

    if (reduceMotion) {
      progress.value = 1;
      finishTransition();
      return;
    }

    progress.value = 0;
    progress.value = withTiming(1, {
      duration: THEME_TRANSITION_MS,
      easing: Easing.inOut(Easing.cubic),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Reanimated shared value ref is stable.
  }, [targetTheme, reduceMotion, finishTransition]);

  return { theme: displayTheme, isTransitioning };
};
