/** @format */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { areAllPermissionsGranted } from '@/domain/permissionSnapshot';
import { isMonitorServiceRunning, startMonitorService, stopMonitorService } from '@/specs';
import { scheduleAfterInteractions } from '@/utils/scheduleAfterInteractions';

import { zustandStorage } from './mmkv';
import { MONITORING_PERSIST_VERSION, PERSIST_STORAGE_KEYS } from './persistSchema';
import type { MonitoringStore, MonitoringToggleResult } from './types';

const MONITOR_START_HEALTH_CHECK_MS = 2_000;

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
        scheduleAfterInteractions(restoreMonitoringSession);
      },
    },
  ),
);

const scheduleMonitoringStartHealthCheck = (): void => {
  const isTestEnvironment = typeof jest !== 'undefined';

  const runCheck = (): void => {
    if (!monitoringStore.getState().isMonitoring || isMonitorServiceRunning()) {
      return;
    }

    monitoringStore.setState({ isMonitoring: false });
  };

  if (isTestEnvironment) {
    runCheck();
    return;
  }

  setTimeout(runCheck, MONITOR_START_HEALTH_CHECK_MS);
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

  const startResult = startMonitorService();

  if (!startResult.started) {
    monitoringStore.setState({ isMonitoring: false });
    return;
  }

  scheduleMonitoringStartHealthCheck();
};
