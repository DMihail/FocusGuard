import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { syncSelectedAppsMetadata as mergeSelectedAppsMetadata } from '@/domain/reconcileSelectedApps';

import { zustandStorage } from './mmkv';
import { PERSIST_STORAGE_KEYS, SELECTED_APPS_PERSIST_VERSION } from './persistSchema';
import type { SelectedAppsStore } from './types';

type SelectedAppsPersistedState = Pick<SelectedAppsStore, 'apps'>;

export const selectedAppsStore = create<SelectedAppsStore>()(
  persist(
    (set, get) => ({
      apps: [],

      toggleApp: (app) => {
        const { apps } = get();
        const isAlreadySelected = apps.some((item) => item.packageName === app.packageName);

        set({
          apps: isAlreadySelected ? apps.filter((item) => item.packageName !== app.packageName) : [...apps, app],
        });
      },

      replaceApps: (apps) => {
        set({ apps });
      },

      isSelected: (packageName) => get().apps.some((app) => app.packageName === packageName),

      syncSelectedAppsMetadata: (installedApps) => {
        const nextApps = mergeSelectedAppsMetadata(get().apps, installedApps);

        if (nextApps) {
          set({ apps: nextApps });
        }
      },
    }),
    {
      name: PERSIST_STORAGE_KEYS.selectedApps,
      version: SELECTED_APPS_PERSIST_VERSION,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ apps: state.apps }),
      migrate: (persistedState) => persistedState as SelectedAppsPersistedState,
    },
  ),
);
