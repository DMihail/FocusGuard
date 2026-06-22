/** @format */

import { syncNativeUiThemePreference } from '@/specs/keeptUiThemeClient';

import type { ThemePreference } from './types';

/** Keeps native overlay, notifications, and system chrome aligned with JS theme. */
export const syncNativeUiTheme = (preference: ThemePreference): void => {
  syncNativeUiThemePreference(preference);
};
