/** @format */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from './mmkv';
import { PERSIST_STORAGE_KEYS } from './persistSchema';
import type { OnboardingStore } from './types';

/** Persisted onboarding completion flag for navigation gating. */
export const onboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      isConfirm: false,

      setIsConfirm: (value) => {
        set({ isConfirm: value });
      },
    }),
    {
      name: PERSIST_STORAGE_KEYS.onboarding,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ isConfirm: state.isConfirm }),
    },
  ),
);
