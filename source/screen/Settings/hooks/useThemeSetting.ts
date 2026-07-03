/** @format */

import { useCallback, useMemo } from 'react';

import { useShallow } from 'zustand/react/shallow';

import { useSystemColorScheme } from '@/hooks/useSystemColorScheme';
import { settingsStore } from '@/store';

const THEME_DESCRIPTION_KEY = {
  system: 'settings.darkMode.descriptionSystem',
  dark: 'settings.darkMode.descriptionDark',
  light: 'settings.darkMode.descriptionLight',
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
  const { preference, setThemePreference } = settingsStore(
    useShallow((state) => ({
      preference: state.themePreference,
      setThemePreference: state.setThemePreference,
    })),
  );
  const systemScheme = useSystemColorScheme();

  const isDarkModeEnabled = useMemo(() => resolveIsDark(preference, systemScheme), [preference, systemScheme]);

  const setDarkModeEnabled = useCallback(
    (enabled: boolean) => {
      setThemePreference(enabled ? 'dark' : 'light');
    },
    [setThemePreference],
  );

  return {
    isDarkModeEnabled,
    themePreference: preference,
    descriptionKey:
      preference === 'system'
        ? THEME_DESCRIPTION_KEY.system
        : isDarkModeEnabled
        ? THEME_DESCRIPTION_KEY.dark
        : THEME_DESCRIPTION_KEY.light,
    setDarkModeEnabled,
  };
};
