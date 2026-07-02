/** @format */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { areAllPermissionsGranted } from '@/domain/permissionSnapshot';
import {
  isMonitorServiceRunning,
  startMonitorService,
  stopMonitorService,
  subscribeMonitorServiceStateChanged,
} from '@/specs';
import type { MonitorServiceStateChangedEvent } from '@/specs/types';
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
      onRehydrateStorage: () => () => {
        scheduleMicrotask(restoreMonitoringSession);
      },
    },
  ),
);

const scheduleMonitoringStartHealthCheck = (): void => {
  disposeActiveHealthCheck();

  let settled = false;
  let verifyScheduled = false;

  const settle = (): void => {
    if (settled) {
      return;
    }

    settled = true;
    subscription.remove();

    if (activeHealthCheckCancel === settle) {
      activeHealthCheckCancel = null;
    }
  };

  activeHealthCheckCancel = settle;

  const verifyRunningOrClear = (): void => {
    if (!monitoringStore.getState().isMonitoring) {
      settle();
      return;
    }

    if (isMonitorServiceRunning()) {
      settle();
      return;
    }

    monitoringStore.setState({ isMonitoring: false });
    settle();
  };

  const scheduleVerifyRunningOrClear = (): void => {
    if (verifyScheduled || settled) {
      return;
    }

    verifyScheduled = true;
    scheduleMicrotask(() => {
      verifyScheduled = false;

      if (!settled) {
        verifyRunningOrClear();
      }
    });
  };

  const isStaleStopEvent = (event: MonitorServiceStateChangedEvent): boolean =>
    event.changedAtMs < monitorStartRequestedAtMs;

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
    if (isStaleStopEvent(event)) {
      return;
    }

    scheduleVerifyRunningOrClear();
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
