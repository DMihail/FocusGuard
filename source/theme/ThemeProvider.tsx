/** @format */

import React, { type ReactNode, useEffect, useMemo } from 'react';

import { useSystemColorScheme } from '@/hooks/useSystemColorScheme';
import { syncNativeUiThemePreference } from '@/specs/keeptUiThemeClient';
import { settingsStore } from '@/store';

import { ThemeContext } from './context';
import { createTheme } from './createTheme';

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const preference = settingsStore((state) => state.themePreference);
  const systemScheme = useSystemColorScheme();

  useEffect(() => {
    syncNativeUiThemePreference(preference);
  }, [preference]);

  const theme = useMemo(() => createTheme(preference, systemScheme), [preference, systemScheme]);

  return <ThemeContext value={theme}>{children}</ThemeContext>;
};
