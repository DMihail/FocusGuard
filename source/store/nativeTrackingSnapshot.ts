/** @format */

import { Platform } from 'react-native';

import { getNativeUsageStats } from '@/specs/nativeUsageStatsClient';

import { appLimitsStore } from './appLimitsStore';
import { IOS_SCREEN_TIME_AUTH_MODE, type IosTrackingSnapshot } from './iosTrackingSnapshot';
import { storage } from './mmkv';
import {
  IOS_TRACKING_SNAPSHOT_KEY,
  IOS_TRACKING_SNAPSHOT_VERSION,
  NATIVE_TRACKING_SNAPSHOT_KEY,
  NATIVE_TRACKING_SNAPSHOT_VERSION,
} from './persistSchema';
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

export const buildIosTrackingSnapshot = (): IosTrackingSnapshot => ({
  version: IOS_TRACKING_SNAPSHOT_VERSION,
  platform: 'ios',
  authMode: IOS_SCREEN_TIME_AUTH_MODE,
  trackedAppTokenIds: selectedAppsStore.getState().apps.map((app) => app.packageName),
  limitsByTokenId: appLimitsStore.getState().limitsByPackage,
});

/** Writes the flat snapshot for native monitoring via Turbo Module, with MMKV fallback in tests. */
export const syncNativeTrackingSnapshot = (): void => {
  const snapshot = Platform.OS === 'ios' ? buildIosTrackingSnapshot() : buildNativeTrackingSnapshot();
  const snapshotJson = JSON.stringify(snapshot);
  const nativeModule = getNativeUsageStats();

  if (nativeModule) {
    nativeModule.syncTrackingConfig(snapshotJson);
    return;
  }

  const fallbackKey = Platform.OS === 'ios' ? IOS_TRACKING_SNAPSHOT_KEY : NATIVE_TRACKING_SNAPSHOT_KEY;
  storage.set(fallbackKey, snapshotJson);
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
