/** @format */

export type OnboardingStore = {
  isConfirm: boolean;
  hasHydrated: boolean;
  setIsConfirm: (value: boolean) => void;
  setHasHydrated: (value: boolean) => void;
};
