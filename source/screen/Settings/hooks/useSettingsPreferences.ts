/** @format */

import { useMemo } from 'react';

import { useTheme } from '@/hooks/useTheme';

import { createDarkModeToggle, createDataPrivacyLink, createNotificationsToggle } from '../data/preferences';
import { useThemeSetting } from './useThemeSetting';

export const useSettingsPreferences = () => {
  const { colors } = useTheme();
  const { description: themeDescription, isDarkModeEnabled, setDarkModeEnabled } = useThemeSetting();

  return useMemo(
    () => ({
      isDarkModeEnabled,
      setDarkModeEnabled,
      notificationsToggle: createNotificationsToggle(colors),
      darkModeToggle: { ...createDarkModeToggle(colors), description: themeDescription },
      dataPrivacyLink: createDataPrivacyLink(colors),
    }),
    [colors, isDarkModeEnabled, setDarkModeEnabled, themeDescription],
  );
};
