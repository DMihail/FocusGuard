/** @format */

import { useMemo } from 'react';
import { Platform } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/i18n';

import {
  createAccessibilityServiceToggle,
  createDarkModeToggle,
  createDataPrivacyLink,
  createLanguageLink,
  createNotificationsToggle,
} from '../data/preferences';
import { useLanguageSetting } from './useLanguageSetting';
import { useThemeSetting } from './useThemeSetting';

export const useSettingsPreferences = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { descriptionKey, isDarkModeEnabled, setDarkModeEnabled } = useThemeSetting();
  const { description: languageDescription, openLanguagePicker } = useLanguageSetting();

  return useMemo(
    () => ({
      isDarkModeEnabled,
      setDarkModeEnabled,
      openLanguagePicker,
      notificationsToggle: createNotificationsToggle(colors, t),
      accessibilityToggle: Platform.OS === 'android' ? createAccessibilityServiceToggle(colors, t) : undefined,
      darkModeToggle: {
        ...createDarkModeToggle(colors, t),
        description: t(descriptionKey),
      },
      languageLink: createLanguageLink(colors, t, languageDescription),
      dataPrivacyLink: createDataPrivacyLink(colors, t),
    }),
    [colors, descriptionKey, isDarkModeEnabled, languageDescription, openLanguagePicker, setDarkModeEnabled, t],
  );
};
