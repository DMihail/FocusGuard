/** @format */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { areAllPermissionsGranted } from '@/domain/permissionSnapshot';
import { isMonitorServiceRunning, startMonitorService, stopMonitorService } from '@/specs';
import { scheduleMicrotask } from '@/utils/scheduleMicrotask';

import { zustandStorage } from './mmkv';
import { MONITORING_PERSIST_VERSION, PERSIST_STORAGE_KEYS } from './persistSchema';
import type { MonitoringStore, MonitoringToggleResult } from './types';

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
        scheduleMicrotask(restoreMonitoringSession);
      },
    },
  ),
);

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
};
