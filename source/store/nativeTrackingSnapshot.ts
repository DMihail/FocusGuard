/** @format */

import { reportError } from '@/crashlytics/reportError';
import { syncTrackingConfig } from '@/specs';
import { getKeeptTurboModule } from '@/specs/keeptTurboModuleClient';

import { appLimitsStore } from './appLimitsStore';
import { storage } from './mmkv';
import { buildPlatformTrackingSnapshot, platformTrackingSnapshotKey } from './platformTrackingSnapshot';
import { selectedAppsStore } from './selectedAppsStore';

let lastSnapshotJson: string | null = null;

export const resetNativeTrackingSnapshotSyncForTests = (): void => {
  lastSnapshotJson = null;
};

export const syncNativeTrackingSnapshot = (): void => {
  const snapshotJson = JSON.stringify(buildPlatformTrackingSnapshot());

  if (snapshotJson === lastSnapshotJson) {
    return;
  }

  lastSnapshotJson = snapshotJson;
  const nativeModule = getKeeptTurboModule();

  if (nativeModule) {
    syncTrackingConfig(snapshotJson);
    return;
  }

  storage.set(platformTrackingSnapshotKey, snapshotJson);
  reportError(
    '[syncNativeTrackingSnapshot] Native module unavailable; MMKV updated without native cache invalidation.',
  );
};

let unsubscribeSelectedApps: (() => void) | null = null;
let unsubscribeAppLimits: (() => void) | null = null;

/** Subscribes to tracked-app and limit changes and keeps the native snapshot in sync. */
export const startNativeTrackingSnapshotSync = (): (() => void) => {
  syncNativeTrackingSnapshot();

  if (!unsubscribeSelectedApps) {
    unsubscribeSelectedApps = selectedAppsStore.subscribe((state, previous) => {
      if (state.apps !== previous.apps) {
        syncNativeTrackingSnapshot();
      }
    });
  }

  if (!unsubscribeAppLimits) {
    unsubscribeAppLimits = appLimitsStore.subscribe((state, previous) => {
      if (state.limitsByAppKey !== previous.limitsByAppKey) {
        syncNativeTrackingSnapshot();
      }
    });
  }

  return () => {
    unsubscribeSelectedApps?.();
    unsubscribeSelectedApps = null;
    unsubscribeAppLimits?.();
    unsubscribeAppLimits = null;
  };
};
