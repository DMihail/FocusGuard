/** @format */

import { reportError } from '@/crashlytics/reportError';

/** Logs async failures in development and reports them to Crashlytics in release. */
export const logDevWarning = (error: unknown): void => {
  reportError(error);
};
