/** @format */

import { createContext, use } from 'react';

import type { ColorPalette, ResolvedColorScheme, Theme, ThemePreference, ThemePresets } from '@/theme/types';

export type ThemeShell = {
  presets: ThemePresets;
  colorScheme: ResolvedColorScheme;
  isDark: boolean;
  preference: ThemePreference;
};

export const ThemeColorsContext = createContext<ColorPalette | undefined>(undefined);
export const ThemeShellContext = createContext<ThemeShell | undefined>(undefined);

export const useThemeColors = (): ColorPalette => {
  const colors = use(ThemeColorsContext);

  if (!colors) {
    throw new Error('useThemeColors must be used within ThemeProvider');
  }

  return colors;
};

export const useThemeShell = (): ThemeShell => {
  const shell = use(ThemeShellContext);

  if (!shell) {
    throw new Error('useThemeShell must be used within ThemeProvider');
  }

  return shell;
};

/** Full theme for style factories and legacy callers. */
export const useTheme = (): Theme => {
  const colors = useThemeColors();
  const shell = useThemeShell();

  return { colors, ...shell };
};

// Backward-compatible alias used by ThemeProvider.
export const ThemeContext = ThemeColorsContext;
