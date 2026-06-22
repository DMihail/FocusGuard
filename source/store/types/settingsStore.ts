/** @format */

import type { ThemePreference } from '@/theme/types';

export type SettingsStore = {
  notificationsEnabled: boolean;
  themePreference: ThemePreference;
  setNotificationsEnabled: (value: boolean) => void;
  setThemePreference: (value: ThemePreference) => void;
};
