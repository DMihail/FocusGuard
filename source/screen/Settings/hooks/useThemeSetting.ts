/** @format */

import { useCallback, useMemo } from 'react';

import { useSystemColorScheme } from '@/hooks/useSystemColorScheme';
import { settingsStore } from '@/store';

const THEME_DESCRIPTION = {
  system: 'Matches your device appearance',
  dark: 'Dark appearance',
  light: 'Light appearance',
} as const;

const resolveIsDark = (
  preference: 'system' | 'light' | 'dark',
  systemScheme: ReturnType<typeof useSystemColorScheme>,
) => {
  if (preference === 'light') {
    return false;
  }

  if (preference === 'dark') {
    return true;
  }

  return systemScheme !== 'light';
};

export const useThemeSetting = () => {
  const preference = settingsStore((state) => state.themePreference);
  const systemScheme = useSystemColorScheme();
  const setThemePreference = settingsStore((state) => state.setThemePreference);

  const isDarkModeEnabled = useMemo(() => resolveIsDark(preference, systemScheme), [preference, systemScheme]);

  const setDarkModeEnabled = useCallback(
    (enabled: boolean) => {
      setThemePreference(enabled ? 'dark' : 'light');
    },
    [setThemePreference],
  );

  const description = useMemo(
    () =>
      preference === 'system'
        ? THEME_DESCRIPTION.system
        : isDarkModeEnabled
        ? THEME_DESCRIPTION.dark
        : THEME_DESCRIPTION.light,
    [isDarkModeEnabled, preference],
  );

  return {
    isDarkModeEnabled,
    themePreference: preference,
    description,
    setDarkModeEnabled,
  };
};
