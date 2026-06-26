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

import type { ThemeShell } from '@/hooks/useTheme';
import { suppressLayoutAnimation } from '@/utils/layoutAnimation';

import { createTheme } from './createTheme';
import { areColorPalettesEqual, interpolateColorPalette } from './interpolateColorPalette';
import type { ColorPalette, Theme, ThemePreference } from './types';

const THEME_TRANSITION_MS = 380;

type ThemeTransitionResult = {
  colors: ColorPalette;
  shell: ThemeShell;
  isTransitioning: boolean;
};

const toShell = (theme: Theme): ThemeShell => ({
  presets: theme.presets,
  colorScheme: theme.colorScheme,
  isDark: theme.isDark,
  preference: theme.preference,
});

export const useThemeTransition = (
  preference: ThemePreference,
  systemScheme: ColorSchemeName | null | undefined,
): ThemeTransitionResult => {
  const targetTheme = useMemo(() => createTheme(preference, systemScheme), [preference, systemScheme]);
  const [displayColors, setDisplayColors] = useState(targetTheme.colors);
  const [displayShell, setDisplayShell] = useState<ThemeShell>(() => toShell(targetTheme));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const displayColorsRef = useRef(targetTheme.colors);
  const fromColorsRef = useRef(targetTheme.colors);
  const targetThemeRef = useRef(targetTheme);
  const progress = useSharedValue(1);
  const reduceMotion = useReducedMotion();
  const hasMountedRef = useRef(false);

  targetThemeRef.current = targetTheme;

  const finishTransition = useCallback(() => {
    const nextTheme = targetThemeRef.current;
    displayColorsRef.current = nextTheme.colors;
    fromColorsRef.current = nextTheme.colors;
    setDisplayColors(nextTheme.colors);
    setDisplayShell(toShell(nextTheme));
    setIsTransitioning(false);
  }, []);

  const applyBlendedColors = useCallback((progressValue: number) => {
    if (progressValue <= 0) {
      return;
    }

    const nextColors = interpolateColorPalette(fromColorsRef.current, targetThemeRef.current.colors, progressValue);
    displayColorsRef.current = nextColors;
    setDisplayColors(nextColors);
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

      runOnJS(applyBlendedColors)(value);
    },
  );

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      displayColorsRef.current = targetTheme.colors;
      fromColorsRef.current = targetTheme.colors;
      setDisplayColors(targetTheme.colors);
      setDisplayShell(toShell(targetTheme));
      return;
    }

    const currentColors = displayColorsRef.current;

    if (areColorPalettesEqual(currentColors, targetTheme.colors)) {
      displayColorsRef.current = targetTheme.colors;
      fromColorsRef.current = targetTheme.colors;
      setDisplayColors(targetTheme.colors);
      setDisplayShell(toShell(targetTheme));
      setIsTransitioning(false);
      progress.value = 1;
      return;
    }

    suppressLayoutAnimation();
    fromColorsRef.current = currentColors;
    setIsTransitioning(true);
    setDisplayShell((previousShell) => ({
      ...previousShell,
      colorScheme: targetTheme.colorScheme,
      isDark: targetTheme.isDark,
      preference: targetTheme.preference,
      presets: {
        ...previousShell.presets,
        switchTrackColors: targetTheme.presets.switchTrackColors,
        switchThumbColor: targetTheme.presets.switchThumbColor,
      },
    }));

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

  return { colors: displayColors, shell: displayShell, isTransitioning };
};
