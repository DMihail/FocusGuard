/** @format */

import { useMemo } from 'react';

import { useTheme } from '@/hooks/useTheme';
import type { Theme } from '@/theme/types';

type CreateStyles<T> = (theme: Theme) => T;

export const createStylesHook =
  <T>(createStyles: CreateStyles<T>) =>
  (): T => {
    const theme = useTheme();

    return useMemo(() => createStyles(theme), [theme]);
  };
