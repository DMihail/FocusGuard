/** @format */

import { useMemo } from 'react';

import type { Theme } from '@/theme/types';

import { useTheme } from './useTheme';

export const useThemedStyles = <T>(factory: (theme: Theme) => T): T => {
  const theme = useTheme();

  return useMemo(() => factory(theme), [factory, theme]);
};

/** Binds a screen style factory to the current theme (avoids repeating useThemedStyles in every component). */
export const createStylesHook =
  <T>(factory: (theme: Theme) => T): (() => T) =>
  () =>
    useThemedStyles(factory);
