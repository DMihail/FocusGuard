/** @format */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { areAllPermissionsGranted } from '@/domain/permissionSnapshot';
import { isMonitorServiceRunning, startMonitorService, stopMonitorService } from '@/specs';
import { scheduleAfterInteractions } from '@/utils/scheduleAfterInteractions';

import { zustandStorage } from './mmkv';
import { MONITORING_PERSIST_VERSION, PERSIST_STORAGE_KEYS } from './persistSchema';
import type { MonitoringStore } from './types';

type MonitoringPersistedState = Pick<MonitoringStore, 'isMonitoring'>;

/** Persisted focus-mode toggle; starts/stops the native monitor foreground service. */
export const monitoringStore = create<MonitoringStore>()(
  persist(
    (set, get) => ({
      isMonitoring: false,

      toggle: () => {
        const next = !get().isMonitoring;

        if (next) {
          if (!areAllPermissionsGranted()) {
            return;
          }

          const startResult = startMonitorService();

          if (!startResult.started) {
            return;
          }

          set({ isMonitoring: true });
          scheduleAfterInteractions(() => {
            if (!get().isMonitoring || isMonitorServiceRunning()) {
              return;
            }

            set({ isMonitoring: false });
          });
          return;
        }

        stopMonitorService();
        set({ isMonitoring: false });
      },
    }),
    {
      name: PERSIST_STORAGE_KEYS.monitoring,
      version: MONITORING_PERSIST_VERSION,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ isMonitoring: state.isMonitoring }),
      migrate: (persistedState) => persistedState as MonitoringPersistedState,
      onRehydrateStorage: () => () => {
        scheduleAfterInteractions(restoreMonitoringSession);
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
  }
};
