/** @format */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_APP_LIMITS } from './constants/appLimits';
import { zustandStorage } from './mmkv';
import type { AppLimitsStore } from './types';
import { normalizeAppLimits } from './utils/normalizeAppLimits';

export { DEFAULT_APP_LIMITS, LIMIT_SLIDER_BOUNDS } from './constants/appLimits';
export { normalizeAppLimits } from './utils/normalizeAppLimits';

export const appLimitsStore = create<AppLimitsStore>()(
  persist(
    (set, get) => ({
      limitsByPackage: {},

      getLimits: (packageName) => get().limitsByPackage[packageName] ?? DEFAULT_APP_LIMITS,

      setLimits: (packageName, limits) => {
        const normalized = normalizeAppLimits(limits);

        set({
          limitsByPackage: {
            ...get().limitsByPackage,
            [packageName]: normalized,
          },
        });
      },
    }),
    {
      name: 'app-limits-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ limitsByPackage: state.limitsByPackage }),
    },
  ),
);
