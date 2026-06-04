/** @format */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from './mmkv';
import type { OnboardingStore } from './types';

export const onboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      isConfirm: false,
      hasHydrated: false,

      setIsConfirm: (value) => {
        set({ isConfirm: value });
      },

      setHasHydrated: (value) => {
        set({ hasHydrated: value });
      },
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ isConfirm: state.isConfirm }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
