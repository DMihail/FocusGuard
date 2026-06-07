/** @format */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { hasSelectedAppsMetadataDrift, reconcileSelectedAppsWithInstalled } from '@/domain/reconcileSelectedApps';

import { zustandStorage } from './mmkv';
import type { SelectedAppsStore } from './types';

/** Persisted list of user-selected apps to track and limit. */
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

      isSelected: (packageName) => get().apps.some((app) => app.packageName === packageName),

      syncSelectedAppsMetadata: (installedApps) => {
        const { apps } = get();

        if (!hasSelectedAppsMetadataDrift(apps, installedApps)) {
          return;
        }

        set({ apps: reconcileSelectedAppsWithInstalled(apps, installedApps) });
      },
    }),
    {
      name: 'selected-apps-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ apps: state.apps }),
    },
  ),
);
