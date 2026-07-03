/** @format */

import React, { createContext, type ReactNode, useContext } from 'react';

import { usePersistHydrated } from '@/hooks/usePersistHydrated';
import { appLimitsStore, onboardingStore, selectedAppsStore } from '@/store';

const CoreStoresHydrationContext = createContext(false);

const useCoreStoresHydratedState = (): boolean => {
  const hasOnboardingHydrated = usePersistHydrated(onboardingStore);
  const hasSelectedAppsHydrated = usePersistHydrated(selectedAppsStore);
  const hasAppLimitsHydrated = usePersistHydrated(appLimitsStore);

  return hasOnboardingHydrated && hasSelectedAppsHydrated && hasAppLimitsHydrated;
};

type CoreStoresHydrationProviderProps = {
  children: ReactNode;
};

/** Shares one hydration subscription set for onboarding, selected apps, and limits stores. */
export const CoreStoresHydrationProvider = ({ children }: CoreStoresHydrationProviderProps) => {
  const hasCoreStoresHydrated = useCoreStoresHydratedState();

  return (
    <CoreStoresHydrationContext.Provider value={hasCoreStoresHydrated}>{children}</CoreStoresHydrationContext.Provider>
  );
};

/** Returns true once stores required for the initial navigation route have rehydrated. */
export const useCoreStoresHydrated = (): boolean => useContext(CoreStoresHydrationContext);
