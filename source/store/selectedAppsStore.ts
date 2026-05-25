/** @format */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ManageApp } from '@/screen/ManageApps/types';
import { zustandStorage } from './mmkv';

type SelectedAppsStore = {
  apps: ManageApp[];
  toggleApp: (app: ManageApp) => void;
  isSelected: (packageName: string) => boolean;
};

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
    }),
    {
      name: 'selected-apps-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ apps: state.apps }),
    },
  ),
);
