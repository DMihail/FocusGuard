/** @format */

import { syncSettingsConfig } from '@/specs';

import { NATIVE_SETTINGS_SNAPSHOT_KEY, NATIVE_SETTINGS_SNAPSHOT_VERSION } from './persistSchema';
import { settingsStore } from './settingsStore';
import { createNativeSnapshotSync } from './syncNativeSnapshot';

export const buildSettingsSnapshot = (): {
  version: number;
  themePreference: string;
  notificationsEnabled: boolean;
} => {
  const { themePreference, notificationsEnabled } = settingsStore.getState();
  return {
    version: NATIVE_SETTINGS_SNAPSHOT_VERSION,
    themePreference,
    notificationsEnabled,
  };
};

const settingsSnapshotSync = createNativeSnapshotSync({
  build: () => buildSettingsSnapshot(),
  writeNative: syncSettingsConfig,
  fallbackKey: NATIVE_SETTINGS_SNAPSHOT_KEY,
  errorLabel: 'syncNativeSettingsSnapshot',
});

export const resetNativeSettingsSnapshotSyncForTests = settingsSnapshotSync.resetForTests;
export const syncNativeSettingsSnapshot = settingsSnapshotSync.sync;

let unsubscribeSettings: (() => void) | null = null;

/** Subscribes to settings used by native and keeps the flat snapshot in sync. */
export const startNativeSettingsSnapshotSync = (): (() => void) => {
  syncNativeSettingsSnapshot();

  if (!unsubscribeSettings) {
    unsubscribeSettings = settingsStore.subscribe((state, previous) => {
      if (
        state.themePreference !== previous.themePreference ||
        state.notificationsEnabled !== previous.notificationsEnabled
      ) {
        syncNativeSettingsSnapshot();
      }
    });
  }

  return () => {
    unsubscribeSettings?.();
    unsubscribeSettings = null;
  };
};
