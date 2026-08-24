/** @format */

import { reportError } from '@/crashlytics/reportError';
import { syncMonitoringState } from '@/specs';
import { getKeeptTurboModule } from '@/specs/keeptTurboModuleClient';

import { storage } from './mmkv';
import { monitoringStore } from './monitoringStore';
import { NATIVE_MONITORING_SNAPSHOT_KEY, NATIVE_MONITORING_SNAPSHOT_VERSION } from './persistSchema';

let lastSnapshotJson: string | null = null;

export const resetNativeMonitoringSnapshotSyncForTests = (): void => {
  lastSnapshotJson = null;
};

export const buildMonitoringSnapshot = (): {
  version: number;
  isMonitoring: boolean;
} => ({
  version: NATIVE_MONITORING_SNAPSHOT_VERSION,
  isMonitoring: monitoringStore.getState().isMonitoring,
});

export const syncNativeMonitoringSnapshot = (): void => {
  const snapshotJson = JSON.stringify(buildMonitoringSnapshot());

  if (snapshotJson === lastSnapshotJson) {
    return;
  }

  lastSnapshotJson = snapshotJson;
  const nativeModule = getKeeptTurboModule();

  if (nativeModule) {
    syncMonitoringState(snapshotJson);
    return;
  }

  storage.set(NATIVE_MONITORING_SNAPSHOT_KEY, snapshotJson);
  reportError(
    '[syncNativeMonitoringSnapshot] Native module unavailable; MMKV updated without native cache invalidation.',
  );
};

let unsubscribeMonitoring: (() => void) | null = null;

/** Subscribes to focus-mode changes and keeps the native monitoring snapshot in sync. */
export const startNativeMonitoringSnapshotSync = (): (() => void) => {
  syncNativeMonitoringSnapshot();

  if (!unsubscribeMonitoring) {
    unsubscribeMonitoring = monitoringStore.subscribe((state, previous) => {
      if (state.isMonitoring !== previous.isMonitoring) {
        syncNativeMonitoringSnapshot();
      }
    });
  }

  return () => {
    unsubscribeMonitoring?.();
    unsubscribeMonitoring = null;
  };
};
