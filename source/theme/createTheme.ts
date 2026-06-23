/** @format */

import type { ColorSchemeName } from 'react-native';

import { createPresets } from './createPresets';
import { colorsByScheme } from './palettes';
import type { ResolvedColorScheme, Theme, ThemePreference } from './types';

const resolveColorScheme = (
  preference: ThemePreference,
  systemScheme: ColorSchemeName | null | undefined,
): ResolvedColorScheme => {
  if (preference === 'light' || preference === 'dark') {
    return preference;
  }

  return systemScheme === 'light' ? 'light' : 'dark';
};

export const createTheme = (preference: ThemePreference, systemScheme: ColorSchemeName | null | undefined): Theme => {
  const colorScheme = resolveColorScheme(preference, systemScheme);
  const colors = colorsByScheme[colorScheme];

  return {
    colors,
    presets: createPresets(colors),
    colorScheme,
    isDark: colorScheme === 'dark',
    preference,
  };
};
