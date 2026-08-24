/** @format */

import { reportError } from '@/crashlytics/reportError';
import { syncSettingsConfig } from '@/specs';
import { getKeeptTurboModule } from '@/specs/keeptTurboModuleClient';

import { storage } from './mmkv';
import { NATIVE_SETTINGS_SNAPSHOT_KEY, NATIVE_SETTINGS_SNAPSHOT_VERSION } from './persistSchema';
import { settingsStore } from './settingsStore';

let lastSnapshotJson: string | null = null;

export const resetNativeSettingsSnapshotSyncForTests = (): void => {
  lastSnapshotJson = null;
};

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

export const syncNativeSettingsSnapshot = (): void => {
  const snapshotJson = JSON.stringify(buildSettingsSnapshot());

  if (snapshotJson === lastSnapshotJson) {
    return;
  }

  lastSnapshotJson = snapshotJson;
  const nativeModule = getKeeptTurboModule();

  if (nativeModule) {
    syncSettingsConfig(snapshotJson);
    return;
  }

  storage.set(NATIVE_SETTINGS_SNAPSHOT_KEY, snapshotJson);
  reportError(
    '[syncNativeSettingsSnapshot] Native module unavailable; MMKV updated without native cache invalidation.',
  );
};

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
