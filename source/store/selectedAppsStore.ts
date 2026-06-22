import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getManageAppKey } from '@/domain/appKey';
import { syncSelectedAppsMetadata as mergeSelectedAppsMetadata } from '@/domain/reconcileSelectedApps';

import { zustandStorage } from './mmkv';
import { PERSIST_STORAGE_KEYS, SELECTED_APPS_PERSIST_VERSION } from './persistSchema';
import type { SelectedAppsStore } from './types';

export const selectedAppsStore = create<SelectedAppsStore>()(
  persist(
    (set, get) => ({
      apps: [],

      toggleApp: (app) => {
        const { apps } = get();
        const appKey = getManageAppKey(app);
        const isAlreadySelected = apps.some((item) => getManageAppKey(item) === appKey);

        set({
          apps: isAlreadySelected ? apps.filter((item) => getManageAppKey(item) !== appKey) : [...apps, app],
        });
      },

      replaceApps: (apps) => {
        set({ apps });
      },

      isSelected: (appKey) => get().apps.some((app) => getManageAppKey(app) === appKey),

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
    },
  ),
);
