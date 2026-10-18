/** @format */

import { syncTrackingConfig } from '@/specs';

import { appLimitsStore } from './appLimitsStore';
import { buildPlatformTrackingSnapshot, platformTrackingSnapshotKey } from './platformTrackingSnapshot';
import { selectedAppsStore } from './selectedAppsStore';
import { createNativeSnapshotSync } from './syncNativeSnapshot';

const trackingSnapshotSync = createNativeSnapshotSync({
  build: () => buildPlatformTrackingSnapshot(),
  writeNative: syncTrackingConfig,
  fallbackKey: platformTrackingSnapshotKey,
  errorLabel: 'syncNativeTrackingSnapshot',
});

export const resetNativeTrackingSnapshotSyncForTests = trackingSnapshotSync.resetForTests;
export const syncNativeTrackingSnapshot = trackingSnapshotSync.sync;

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
