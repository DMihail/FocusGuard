/** @format */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from './mmkv';
import { PERSIST_STORAGE_KEYS, SETTINGS_PERSIST_VERSION } from './persistSchema';
import type { SettingsStore } from './types';

/** Persisted user preferences (notification toggle). */
export const settingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      themePreference: 'system',
      languagePreference: 'system',
      setNotificationsEnabled: (value) => set({ notificationsEnabled: value }),
      setThemePreference: (value) => set({ themePreference: value }),
      setLanguagePreference: (value) => set({ languagePreference: value }),
    }),
    {
      name: PERSIST_STORAGE_KEYS.settings,
      version: SETTINGS_PERSIST_VERSION,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        notificationsEnabled: state.notificationsEnabled,
        themePreference: state.themePreference,
        languagePreference: state.languagePreference,
      }),
    },
  ),
);
