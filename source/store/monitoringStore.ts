/** @format */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { reportError } from '@/crashlytics/reportError';
import { areAllPermissionsGranted } from '@/domain/permissionSnapshot';
import {
  isMonitorServiceRunning,
  startMonitorService,
  stopMonitorService,
  subscribeMonitorServiceStateChanged,
} from '@/specs';
import { scheduleMicrotask } from '@/utils/scheduleMicrotask';

import { zustandStorage } from './mmkv';
import { MONITORING_PERSIST_VERSION, PERSIST_STORAGE_KEYS } from './persistSchema';
import type { MonitoringStore, MonitoringToggleResult } from './types';

let monitorStartRequestedAtMs = 0;
let activeHealthCheckCancel: (() => void) | null = null;

const disposeActiveHealthCheck = (): void => {
  activeHealthCheckCancel?.();
  activeHealthCheckCancel = null;
};

const markMonitorStartRequested = (): void => {
  monitorStartRequestedAtMs = Date.now();
};

/** Persisted focus-mode toggle; starts/stops the native monitor foreground service. */
export const monitoringStore = create<MonitoringStore>()(
  persist(
    (set, get) => ({
      isMonitoring: false,

      toggle: (): MonitoringToggleResult => {
        const next = !get().isMonitoring;

        if (next) {
          if (!areAllPermissionsGranted()) {
            return { ok: false, reason: 'permissions_missing' };
          }

          set({ isMonitoring: true });

          markMonitorStartRequested();
          const startResult = startMonitorService();

          if (!startResult.started) {
            // FGS background block is an expected API 34+ restriction — not Crashlytics-worthy.
            if (startResult.reason !== 'background_start_blocked') {
              reportError(new Error(`Monitor service start failed: ${startResult.reason ?? 'unknown'}`));
            }
            set({ isMonitoring: false });
            return {
              ok: false,
              reason: 'service_start_failed',
              detail: startResult.reason,
            };
          }

          scheduleMonitoringStartHealthCheck();
          return { ok: true };
        }

        disposeActiveHealthCheck();
        stopMonitorService();
        set({ isMonitoring: false });
        return { ok: true };
      },
    }),
    {
      name: PERSIST_STORAGE_KEYS.monitoring,
      version: MONITORING_PERSIST_VERSION,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ isMonitoring: state.isMonitoring }),
      // Cold-start restore is owned by `useMonitoringServiceSync` (onFinishHydration + foreground + native stop).
    },
  ),
);

const scheduleMonitoringStartHealthCheck = (): void => {
  disposeActiveHealthCheck();

  let settled = false;

  const cancel = (): void => {
    settle();
  };

  const settle = (): void => {
    if (settled) {
      return;
    }

    settled = true;
    subscription.remove();

    if (activeHealthCheckCancel === cancel) {
      activeHealthCheckCancel = null;
    }
  };

  activeHealthCheckCancel = cancel;

  const subscription = subscribeMonitorServiceStateChanged((event) => {
    if (!monitoringStore.getState().isMonitoring) {
      settle();
      return;
    }

    if (event.isRunning) {
      settle();
      return;
    }

    // A delayed `false` from the previous service teardown can arrive while a new start is in flight.
    if (event.changedAtMs < monitorStartRequestedAtMs) {
      return;
    }

    scheduleMicrotask(() => {
      if (settled || !monitoringStore.getState().isMonitoring) {
        return;
      }

      if (isMonitorServiceRunning()) {
        settle();
        return;
      }

      monitoringStore.setState({ isMonitoring: false });
      reportError(new Error('Monitor service stopped unexpectedly after start'));
      settle();
    });
  });

  // Android reports `started` before onStartCommand flips isRunning; wait for native events.
  if (monitoringStore.getState().isMonitoring && isMonitorServiceRunning()) {
    settle();
  }
};

/** Restarts the monitor service for a persisted session or clears stale monitoring state. */
export const restoreMonitoringSession = (): void => {
  if (!monitoringStore.getState().isMonitoring) {
    return;
  }

  if (isMonitorServiceRunning()) {
    return;
  }

  if (!areAllPermissionsGranted()) {
    monitoringStore.setState({ isMonitoring: false });
    return;
  }

  markMonitorStartRequested();
  const startResult = startMonitorService();

  if (!startResult.started) {
    // Keep intent on; native pending / next foreground resume will retry (API 34+ FGS rules).
    if (startResult.reason === 'background_start_blocked') {
      return;
    }
    reportError(new Error(`Monitor service restore failed: ${startResult.reason ?? 'unknown'}`));
    monitoringStore.setState({ isMonitoring: false });
    return;
  }

  scheduleMonitoringStartHealthCheck();
};

/** @internal */
export const resetMonitoringStartHealthCheckForTests = (): void => {
  disposeActiveHealthCheck();
  monitorStartRequestedAtMs = 0;
};
