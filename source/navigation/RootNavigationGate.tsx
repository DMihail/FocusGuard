/** @format */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import type { NavigationContainerRef } from '@react-navigation/native';
import { AppLoader } from './components/AppLoader';
import { useAppPermissionGuard } from './hooks/useAppPermissionGuard';
import { createRootStack } from './RootStack';
import { resolveEntryRoute } from './resolveEntryRoute';
import { onboardingStore } from '@/store/onboardingStore';
import type { RootStackParamList } from './types';

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
