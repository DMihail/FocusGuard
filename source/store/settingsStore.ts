/** @format */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './mmkv';

type SettingsStore = {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (value: boolean) => void;
};

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
