/** @format */

import React, { type ReactNode, useEffect } from 'react';

import { useSystemColorScheme } from '@/hooks/useSystemColorScheme';
import { ThemeColorsContext, ThemeShellContext } from '@/hooks/useTheme';
import { syncNativeUiThemePreference } from '@/specs/keeptUiThemeClient';
import { settingsStore } from '@/store';

import { useThemeTransition } from './useThemeTransition';

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const preference = settingsStore((state) => state.themePreference);
  const systemScheme = useSystemColorScheme();
  const { colors, shell, isTransitioning } = useThemeTransition(preference, systemScheme);

  useEffect(() => {
    if (!isTransitioning) {
      syncNativeUiThemePreference(preference);
    }
  }, [preference, isTransitioning]);

  return (
    <ThemeShellContext value={shell}>
      <ThemeColorsContext value={colors}>{children}</ThemeColorsContext>
    </ThemeShellContext>
  );
};
