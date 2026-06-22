/** @format */

import React, { type ReactNode, useEffect, useMemo, useRef } from 'react';

import { useSystemColorScheme } from '@/hooks/useSystemColorScheme';
import { syncNativeUiThemePreference } from '@/specs/keeptUiThemeClient';
import { settingsStore } from '@/store';
import { suppressLayoutAnimation } from '@/utils/layoutAnimation';

import { ThemeContext } from './context';
import { createTheme } from './createTheme';

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const preference = settingsStore((state) => state.themePreference);
  const systemScheme = useSystemColorScheme();
  const themeKeyRef = useRef(`${preference}:${systemScheme}`);
  const themeKey = `${preference}:${systemScheme}`;

  if (themeKeyRef.current !== themeKey) {
    suppressLayoutAnimation();
    themeKeyRef.current = themeKey;
  }

  useEffect(() => {
    syncNativeUiThemePreference(preference);
  }, [preference]);

  const theme = useMemo(() => createTheme(preference, systemScheme), [preference, systemScheme]);

  return <ThemeContext value={theme}>{children}</ThemeContext>;
};
