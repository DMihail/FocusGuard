/** @format */

import { syncTrackingConfig } from '@/specs/nativeUsageStatsApi';
import { getNativeUsageStats } from '@/specs/nativeUsageStatsClient';
import { logDevWarning } from '@/utils/logDevWarning';

import { appLimitsStore } from './appLimitsStore';
import { storage } from './mmkv';
import { buildPlatformTrackingSnapshot, platformTrackingSnapshotKey } from './platformTrackingSnapshot';
import { selectedAppsStore } from './selectedAppsStore';

export const syncNativeTrackingSnapshot = (): void => {
  const snapshotJson = JSON.stringify(buildPlatformTrackingSnapshot());
  const nativeModule = getNativeUsageStats();

  if (nativeModule) {
    syncTrackingConfig(snapshotJson);
    return;
  }

  storage.set(platformTrackingSnapshotKey, snapshotJson);
  logDevWarning(
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
