/** @format */

/** Enables Crashlytics in release builds. No-op in __DEV__ and when native module is unavailable. */
export const bootstrapCrashlytics = (): void => {
  if (__DEV__) {
    return;
  }

  try {
    const crashlytics = require('@react-native-firebase/crashlytics').default as () => {
      setCrashlyticsCollectionEnabled: (enabled: boolean) => Promise<null>;
    };

    crashlytics()
      .setCrashlyticsCollectionEnabled(true)
      .catch(() => undefined);
  } catch {
    // Firebase not configured on this build target.
  }
};
