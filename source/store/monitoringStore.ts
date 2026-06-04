/** @format */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { checkForPermission, startMonitorService, stopMonitorService } from '@/specs';

import { zustandStorage } from './mmkv';
import type { MonitoringStore } from './types';

export const monitoringStore = create<MonitoringStore>()(
  persist(
    (set, get) => ({
      isMonitoring: false,

      toggle: () => {
        const next = !get().isMonitoring;

        if (next) {
          if (!checkForPermission()) {
            return;
          }
          startMonitorService();
        } else {
          stopMonitorService();
        }

        set({ isMonitoring: next });
      },
    }),
    {
      name: 'monitoring-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ isMonitoring: state.isMonitoring }),
      onRehydrateStorage: () => (state) => {
        if (state?.isMonitoring && checkForPermission()) {
          startMonitorService();
        }
      },
    },
  ),
);
