/** @format */

import { createContext, use } from 'react';

import type { Theme } from '@/theme/types';

export const ThemeContext = createContext<Theme | undefined>(undefined);

export const useTheme = (): Theme => {
  const theme = use(ThemeContext);

  if (!theme) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return theme;
};
