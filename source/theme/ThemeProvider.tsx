/** @format */

import React, { type ReactNode, useEffect } from 'react';

import { useSystemColorScheme } from '@/hooks/useSystemColorScheme';
import { syncNativeUiThemePreference } from '@/specs/keeptUiThemeClient';
import { settingsStore } from '@/store';

import { ThemeContext } from './context';
import { useThemeTransition } from './useThemeTransition';

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const preference = settingsStore((state) => state.themePreference);
  const systemScheme = useSystemColorScheme();
  const { theme, isTransitioning } = useThemeTransition(preference, systemScheme);

  useEffect(() => {
    if (!isTransitioning) {
      syncNativeUiThemePreference(preference);
    }
  }, [preference, isTransitioning]);

  return <ThemeContext value={theme}>{children}</ThemeContext>;
};
