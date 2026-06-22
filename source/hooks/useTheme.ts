/** @format */

import { useContext } from 'react';

import { ThemeContext } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/types';

export const useTheme = (): Theme => {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return theme;
};
