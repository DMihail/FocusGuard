/** @format */

import { Platform } from 'react-native';

import { getAppDisplayName as getNativeAppDisplayName } from '@/specs/NativeUsageStats';

import { displayName, name } from '../../app.json';

/** Fallback when the Turbo Module is unavailable (e.g. iOS shell, tests). */
const JS_FALLBACK_DISPLAY_NAME = displayName ?? name;

let cachedDisplayName: string | null = null;

/** User-facing product name from native resources, with JS fallback. */
export const getAppDisplayName = (): string => {
  if (cachedDisplayName !== null) {
    return cachedDisplayName;
  }

  if (Platform.OS === 'android') {
    const nativeName = getNativeAppDisplayName();
    if (nativeName.length > 0) {
      cachedDisplayName = nativeName;
      return nativeName;
    }
  }

  cachedDisplayName = JS_FALLBACK_DISPLAY_NAME;
  return cachedDisplayName;
};
