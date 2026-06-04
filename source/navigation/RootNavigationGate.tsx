/** @format */

import React, { useEffect, useMemo, useRef, useState } from 'react';

import type { NavigationContainerRef } from '@react-navigation/native';
import { createStaticNavigation } from '@react-navigation/native';

import { onboardingStore } from '@/store/onboardingStore';

import { useAppPermissionGuard } from './hooks/useAppPermissionGuard';
import { resolveEntryRoute } from './resolveEntryRoute';
import { createRootStack } from './RootStack';
import type { RootStackParamList } from './types';

import { AppLoader } from './components/AppLoader';

export const RootNavigationGate = () => {
  const hasHydrated = onboardingStore((state) => state.hasHydrated);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  const Navigation = useMemo(() => {
    if (!initialRoute) {
      return null;
    }

    return createStaticNavigation(createRootStack(initialRoute));
  }, [initialRoute]);

  useEffect(() => {
    if (!hasHydrated || initialRoute !== null) {
      return;
    }

    setInitialRoute(resolveEntryRoute(onboardingStore.getState().isConfirm));
  }, [hasHydrated, initialRoute]);

  useAppPermissionGuard(navigationRef, hasHydrated && initialRoute !== null);

  if (!hasHydrated || !Navigation) {
    return <AppLoader />;
  }

  return <Navigation ref={navigationRef} />;
};
