/** @format */

import { useMemo } from 'react';

import type { Theme } from '@/theme/types';

import { useTheme } from './useTheme';

/** Binds a screen style factory to the current theme. */
export const createStylesHook =
  <T>(factory: (theme: Theme) => T): (() => T) =>
  () => {
    const theme = useTheme();

    return useMemo(() => factory(theme), [theme]);
  };
