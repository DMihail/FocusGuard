/** @format */

import { syncMonitoringState } from '@/specs';

import { monitoringStore } from './monitoringStore';
import { NATIVE_MONITORING_SNAPSHOT_KEY, NATIVE_MONITORING_SNAPSHOT_VERSION } from './persistSchema';
import { createNativeSnapshotSync } from './syncNativeSnapshot';

const monitoringSnapshotSync = createNativeSnapshotSync({
  build: () => buildMonitoringSnapshot(),
  writeNative: syncMonitoringState,
  fallbackKey: NATIVE_MONITORING_SNAPSHOT_KEY,
  errorLabel: 'syncNativeMonitoringSnapshot',
});

export const resetNativeMonitoringSnapshotSyncForTests = monitoringSnapshotSync.resetForTests;

export const buildMonitoringSnapshot = (): {
  version: number;
  isMonitoring: boolean;
} => ({
  version: NATIVE_MONITORING_SNAPSHOT_VERSION,
  isMonitoring: monitoringStore.getState().isMonitoring,
});

export const syncNativeMonitoringSnapshot = monitoringSnapshotSync.sync;

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
