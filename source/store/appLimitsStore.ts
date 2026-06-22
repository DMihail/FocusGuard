/** @format */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_APP_LIMITS } from './constants/appLimits';
import { zustandStorage } from './mmkv';
import { APP_LIMITS_PERSIST_VERSION, PERSIST_STORAGE_KEYS } from './persistSchema';
import type { AppLimitsStore } from './types';
import { normalizeAppLimits } from './utils/normalizeAppLimits';

export { DEFAULT_APP_LIMITS, LIMIT_SLIDER_BOUNDS } from './constants/appLimits';
export { normalizeAppLimits } from './utils/normalizeAppLimits';

/** Persisted per-app warning, hard-block, and strict-mode limits (MMKV). */
export const appLimitsStore = create<AppLimitsStore>()(
  persist(
    (set, get) => ({
      limitsByAppKey: {},

      getLimits: (appKey) => get().limitsByAppKey[appKey] ?? DEFAULT_APP_LIMITS,

      setLimits: (appKey, limits) => {
        const normalized = normalizeAppLimits(limits);

        set({
          limitsByAppKey: {
            ...get().limitsByAppKey,
            [appKey]: normalized,
          },
        });
      },
    }),
    {
      name: PERSIST_STORAGE_KEYS.appLimits,
      version: APP_LIMITS_PERSIST_VERSION,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ limitsByAppKey: state.limitsByAppKey }),
    },
  ),
);
