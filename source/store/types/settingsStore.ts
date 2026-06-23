/** @format */

import type { LanguagePreference } from '@/i18n/types';
import type { ThemePreference } from '@/theme/types';

export type SettingsStore = {
  notificationsEnabled: boolean;
  themePreference: ThemePreference;
  languagePreference: LanguagePreference;
  setNotificationsEnabled: (value: boolean) => void;
  setThemePreference: (value: ThemePreference) => void;
  setLanguagePreference: (value: LanguagePreference) => void;
};
