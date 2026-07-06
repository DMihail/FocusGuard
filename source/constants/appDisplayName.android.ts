/** @format */

import { getAppDisplayName as getNativeAppDisplayName } from '@/specs/keeptTurboModuleApi';

import { displayName, name } from '../../app.json';

const JS_FALLBACK_DISPLAY_NAME = displayName ?? name;

let cachedDisplayName: string | null = null;

/** User-facing product name from native Android resources, with JS fallback. */
export const getAppDisplayName = (): string => {
  if (cachedDisplayName !== null) {
    return cachedDisplayName;
  }

  const nativeName = getNativeAppDisplayName();
  if (nativeName.length > 0) {
    cachedDisplayName = nativeName;
    return nativeName;
  }

  cachedDisplayName = JS_FALLBACK_DISPLAY_NAME;
  return cachedDisplayName;
};
