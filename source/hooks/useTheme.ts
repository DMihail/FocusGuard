/** @format */

import { use } from 'react';

import { ThemeContext } from '@/theme/context';
import type { Theme } from '@/theme/types';

export const useTheme = (): Theme => {
  const theme = use(ThemeContext);

  if (!theme) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return theme;
};
