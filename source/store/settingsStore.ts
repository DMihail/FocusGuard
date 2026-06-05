/** @format */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from './mmkv';
import type { SettingsStore } from './types';

/** Persisted user preferences (notification toggle). */
export const settingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      setNotificationsEnabled: (value) => set({ notificationsEnabled: value }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ notificationsEnabled: state.notificationsEnabled }),
    },
  ),
);
