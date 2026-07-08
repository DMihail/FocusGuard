/** @format */

import { getAppVersion as getNativeAppVersion } from '@/specs/keeptTurboModuleApi';

import { version } from '../../package.json';

const JS_FALLBACK_VERSION = version;

let cachedVersion: string | null = null;

/** Marketing version from native Android build config, with JS fallback. */
export const getAppVersion = (): string => {
  if (cachedVersion !== null) {
    return cachedVersion;
  }

  const nativeVersion = getNativeAppVersion();
  if (nativeVersion.length > 0) {
    cachedVersion = nativeVersion;
    return nativeVersion;
  }

  cachedVersion = JS_FALLBACK_VERSION;
  return cachedVersion;
};
