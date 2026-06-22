/** @format */

import { useCallback } from 'react';

import { useTheme } from '@/hooks/useTheme';
import { settingsStore } from '@/store';
import type { ThemePreference } from '@/theme/types';

export const useThemeSetting = () => {
  const { isDark, preference } = useTheme();
  const setThemePreference = settingsStore((state) => state.setThemePreference);

  const setDarkModeEnabled = useCallback(
    (enabled: boolean) => {
      setThemePreference(enabled ? 'dark' : 'light');
    },
    [setThemePreference],
  );

  const description =
    preference === 'system' ? 'Matches your device appearance' : isDark ? 'Dark appearance' : 'Light appearance';

  return {
    isDarkModeEnabled: isDark,
    themePreference: preference as ThemePreference,
    description,
    setDarkModeEnabled,
  };
};
