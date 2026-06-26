/** @format */

import { usePersistHydrated } from '@/hooks/usePersistHydrated';
import { appLimitsStore, onboardingStore, selectedAppsStore } from '@/store';

/** Returns true once stores required for the initial navigation route have rehydrated. */
export const useCoreStoresHydrated = (): boolean => {
  const hasOnboardingHydrated = usePersistHydrated(onboardingStore);
  const hasSelectedAppsHydrated = usePersistHydrated(selectedAppsStore);
  const hasAppLimitsHydrated = usePersistHydrated(appLimitsStore);

  return hasOnboardingHydrated && hasSelectedAppsHydrated && hasAppLimitsHydrated;
};
