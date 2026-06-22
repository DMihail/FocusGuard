/** @format */

import { NativeModules } from 'react-native';

import type { ThemePreference } from '@/theme/types';

type KeeptUiThemeModule = {
  syncPreference: (preference: ThemePreference) => void;
};

export const syncNativeUiThemePreference = (preference: ThemePreference): void => {
  (NativeModules.KeeptUiTheme as KeeptUiThemeModule | undefined)?.syncPreference(preference);
};
