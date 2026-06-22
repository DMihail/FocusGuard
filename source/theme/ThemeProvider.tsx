/** @format */

import React, { createContext, type ReactNode, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';

import { settingsStore } from '@/store';

import { createPresets } from './createPresets';
import { colorsByScheme } from './palettes';
import { resolveColorScheme } from './resolveColorScheme';
import type { Theme } from './types';

export const ThemeContext = createContext<Theme | null>(null);

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const preference = settingsStore((state) => state.themePreference);
  const [systemScheme, setSystemScheme] = useState(() => Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  const theme = useMemo<Theme>(() => {
    const normalizedSystemScheme = systemScheme === 'light' || systemScheme === 'dark' ? systemScheme : undefined;
    const colorScheme = resolveColorScheme(preference, normalizedSystemScheme);
    const colors = colorsByScheme[colorScheme];

    return {
      colors,
      presets: createPresets(colors),
      colorScheme,
      isDark: colorScheme === 'dark',
      preference,
    };
  }, [preference, systemScheme]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
