/** @format */

import { Platform } from 'react-native';

import { getAppVersion as getNativeAppVersion } from '@/specs/NativeUsageStats';

import { version } from '../../package.json';

/** Fallback when the Turbo Module is unavailable (e.g. iOS shell, tests). */
const JS_FALLBACK_VERSION = version;

let cachedVersion: string | null = null;

/** Marketing version from native build config, with JS fallback. */
export const getAppVersion = (): string => {
  if (cachedVersion !== null) {
    return cachedVersion;
  }

  if (Platform.OS === 'android') {
    const nativeVersion = getNativeAppVersion();
    if (nativeVersion.length > 0) {
      cachedVersion = nativeVersion;
      return nativeVersion;
    }
  }

  cachedVersion = JS_FALLBACK_VERSION;
  return cachedVersion;
};
