/** @format */

import { useMemo } from 'react';

import { useThemeColors, useThemeShell } from '@/hooks/useTheme';
import type { Theme } from '@/theme/types';

type CreateStyles<T> = (theme: Theme) => T;

export const createStylesHook =
  <T>(createStyles: CreateStyles<T>) =>
  (): T => {
    const colors = useThemeColors();
    const shell = useThemeShell();
    const theme = useMemo<Theme>(() => ({ colors, ...shell }), [colors, shell]);

    return useMemo(() => createStyles(theme), [theme]);
  };
