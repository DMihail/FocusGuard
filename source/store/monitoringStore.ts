/** @format */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { startMonitorService, stopMonitorService } from '@/specs';
import { zustandStorage } from './mmkv';

type MonitoringStore = {
  isMonitoring: boolean;
  toggle: () => void;
};

export const monitoringStore = create<MonitoringStore>()(
  persist(
    (set, get) => ({
      isMonitoring: false,

      toggle: () => {
        const next = !get().isMonitoring;

        if (next) {
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
    },
  ),
);
