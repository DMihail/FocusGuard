/** @format */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './mmkv';

type OnboardingStore = {
  isConfirm: boolean;

  hasHydrated: boolean;

  setIsConfirm: (value: boolean) => void;

  setHasHydrated: (value: boolean) => void;
};

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
