/** @format */

import { appLimitsStore } from './appLimitsStore';
import { storage } from './mmkv';
import { NATIVE_TRACKING_SNAPSHOT_KEY, NATIVE_TRACKING_SNAPSHOT_VERSION } from './persistSchema';
import { selectedAppsStore } from './selectedAppsStore';
import type { AppLimits } from './types';

export type NativeTrackingSnapshot = {
  version: number;
  trackedApps: string[];
  limitsByPackage: Record<string, AppLimits>;
};

export const buildNativeTrackingSnapshot = (): NativeTrackingSnapshot => ({
  version: NATIVE_TRACKING_SNAPSHOT_VERSION,
  trackedApps: selectedAppsStore.getState().apps.map((app) => app.packageName),
  limitsByPackage: appLimitsStore.getState().limitsByPackage,
});

/** Writes a flat JSON snapshot native monitoring can read without parsing Zustand persist. */
export const syncNativeTrackingSnapshot = (): void => {
  storage.set(NATIVE_TRACKING_SNAPSHOT_KEY, JSON.stringify(buildNativeTrackingSnapshot()));
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
      if (state.limitsByPackage !== previous.limitsByPackage) {
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
