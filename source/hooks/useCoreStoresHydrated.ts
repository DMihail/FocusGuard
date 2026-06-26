/** @format */

import { usePersistHydrated } from '@/hooks/usePersistHydrated';
import { appLimitsStore, onboardingStore, selectedAppsStore } from '@/store';

/** Returns true once onboarding and persisted app-selection stores have rehydrated. */
export const useCoreStoresHydrated = (): boolean => {
  const hasOnboardingHydrated = onboardingStore((state) => state.hasHydrated);
  const hasSelectedAppsHydrated = usePersistHydrated(selectedAppsStore);
  const hasAppLimitsHydrated = usePersistHydrated(appLimitsStore);

  return hasOnboardingHydrated && hasSelectedAppsHydrated && hasAppLimitsHydrated;
};
