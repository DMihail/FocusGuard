/** @format */

import { displayName, name } from '../../app.json';

/** Fallback when the Turbo Module is unavailable (e.g. tests). */
const JS_FALLBACK_DISPLAY_NAME = displayName ?? name;

let cachedDisplayName: string | null = null;

/** User-facing product name with JS fallback on iOS. */
export const getAppDisplayName = (): string => {
  if (cachedDisplayName !== null) {
    return cachedDisplayName;
  }

  cachedDisplayName = JS_FALLBACK_DISPLAY_NAME;
  return cachedDisplayName;
};
