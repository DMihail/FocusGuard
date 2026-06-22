/** @format */

import type { ColorSchemeName } from 'react-native';

import { createPresets } from './createPresets';
import { colorsByScheme } from './palettes';
import { resolveColorScheme } from './resolveColorScheme';
import type { Theme, ThemePreference } from './types';

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
