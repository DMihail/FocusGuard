/** @format */

/** Enables Crashlytics in release builds. No-op in __DEV__ and when native module is unavailable. */
export const bootstrapCrashlytics = (): void => {
  if (__DEV__) {
    return;
  }

  try {
    const { getCrashlytics, setCrashlyticsCollectionEnabled } =
      require('@react-native-firebase/crashlytics') as typeof import('@react-native-firebase/crashlytics');

    setCrashlyticsCollectionEnabled(getCrashlytics(), true).catch(() => undefined);
  } catch {
    // Firebase not configured on this build target.
  }
};
