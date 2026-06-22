/** @format */

import type { ColorSchemeName } from 'react-native';

import type { ResolvedColorScheme, ThemePreference } from './types';

export const resolveColorScheme = (
  preference: ThemePreference,
  systemScheme: ColorSchemeName | null | undefined,
): ResolvedColorScheme => {
  if (preference === 'light' || preference === 'dark') {
    return preference;
  }

  return systemScheme === 'light' ? 'light' : 'dark';
};
