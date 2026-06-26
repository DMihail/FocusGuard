/** @format */

import { usePersistHydrated } from '@/hooks/usePersistHydrated';
import { appLimitsStore, monitoringStore, onboardingStore, selectedAppsStore, settingsStore } from '@/store';

/** Returns true once onboarding and persisted app-selection stores have rehydrated. */
export const useCoreStoresHydrated = (): boolean => {
  const hasOnboardingHydrated = onboardingStore((state) => state.hasHydrated);
  const hasSelectedAppsHydrated = usePersistHydrated(selectedAppsStore);
  const hasAppLimitsHydrated = usePersistHydrated(appLimitsStore);
  const hasSettingsHydrated = usePersistHydrated(settingsStore);
  const hasMonitoringHydrated = usePersistHydrated(monitoringStore);

  return (
    hasOnboardingHydrated &&
    hasSelectedAppsHydrated &&
    hasAppLimitsHydrated &&
    hasSettingsHydrated &&
    hasMonitoringHydrated
  );
};
