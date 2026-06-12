/** @format */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from './mmkv';
import { PERSIST_STORAGE_KEYS, SETTINGS_PERSIST_VERSION } from './persistSchema';
import type { SettingsStore } from './types';

type SettingsPersistedState = Pick<SettingsStore, 'notificationsEnabled'>;

/** Persisted user preferences (notification toggle). */
export const settingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      setNotificationsEnabled: (value) => set({ notificationsEnabled: value }),
    }),
    {
      name: PERSIST_STORAGE_KEYS.settings,
      version: SETTINGS_PERSIST_VERSION,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ notificationsEnabled: state.notificationsEnabled }),
      migrate: (persistedState) => persistedState as SettingsPersistedState,
    },
  ),
);
