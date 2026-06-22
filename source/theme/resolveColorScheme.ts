/** @format */

import type { ResolvedColorScheme, ThemePreference } from './types';

export const resolveColorScheme = (
  preference: ThemePreference,
  systemScheme: 'light' | 'dark' | null | undefined,
): ResolvedColorScheme => {
  if (preference === 'light' || preference === 'dark') {
    return preference;
  }

  return systemScheme === 'light' ? 'light' : 'dark';
};
