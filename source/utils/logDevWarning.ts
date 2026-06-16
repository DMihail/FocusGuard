/** @format */

/** Logs async failures in development without crashing the UI. */
export const logDevWarning = (error: unknown): void => {
  if (__DEV__) {
    console.warn(error);
  }
};
