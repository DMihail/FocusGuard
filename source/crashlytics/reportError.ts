/** @format */

type ErrorContext = Readonly<Record<string, string>>;

/** Reports non-fatal errors to Crashlytics in release; logs to console in development. */
export const reportError = (error: unknown, context?: ErrorContext): void => {
  if (__DEV__) {
    if (context) {
      console.warn(error, context);
      return;
    }

    console.warn(error);
    return;
  }

  try {
    const { getCrashlytics, recordError } =
      require('@react-native-firebase/crashlytics') as typeof import('@react-native-firebase/crashlytics');

    const crashlytics = getCrashlytics();

    if (context) {
      for (const [key, value] of Object.entries(context)) {
        crashlytics.setAttribute(key, value);
      }
    }

    const normalizedError = error instanceof Error ? error : new Error(String(error));
    recordError(crashlytics, normalizedError);
  } catch {
    // Firebase not configured on this build target.
  }
};
