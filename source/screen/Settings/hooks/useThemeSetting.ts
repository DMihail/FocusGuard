/** @format */

import { useCallback, useMemo } from 'react';

import { useTheme } from '@/hooks/useTheme';
import { settingsStore } from '@/store';

const THEME_DESCRIPTION = {
  system: 'Matches your device appearance',
  dark: 'Dark appearance',
  light: 'Light appearance',
} as const;

export const useThemeSetting = () => {
  const { isDark, preference } = useTheme();
  const setThemePreference = settingsStore((state) => state.setThemePreference);

  const setDarkModeEnabled = useCallback(
    (enabled: boolean) => {
      setThemePreference(enabled ? 'dark' : 'light');
    },
    [setThemePreference],
  );

  const description = useMemo(
    () =>
      preference === 'system' ? THEME_DESCRIPTION.system : isDark ? THEME_DESCRIPTION.dark : THEME_DESCRIPTION.light,
    [isDark, preference],
  );

  return {
    isDarkModeEnabled: isDark,
    themePreference: preference,
    description,
    setDarkModeEnabled,
  };
};
