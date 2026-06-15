/** @format */

import { version } from '../../package.json';

let cachedVersion: string | null = null;

/** Marketing version from package.json on iOS. */
export const getAppVersion = (): string => {
  if (cachedVersion !== null) {
    return cachedVersion;
  }

  cachedVersion = version;
  return cachedVersion;
};
