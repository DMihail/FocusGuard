/** @format */

import React, { useEffect, useRef, useState } from 'react';

import type { NavigationContainerRef } from '@react-navigation/native';

import { useNativeTrackingSnapshotSync } from '@/hooks/useNativeTrackingSnapshotSync';
import { usePrefetchNativeCatalogs } from '@/hooks/usePrefetchNativeCatalogs';
import { onboardingStore } from '@/store';

import { useAppPermissionGuard } from './hooks/useAppPermissionGuard';
import { useMonitoringServiceSync } from './hooks/useMonitoringServiceSync';
import { resolveEntryRoute } from './resolveEntryRoute';
import { RootNavigator } from './RootNavigator';
import type { RootStackParamList } from './types';

import { SplashBranding } from '@/components';

export const RootNavigationGate = () => {
  const hasHydrated = onboardingStore((state) => state.hasHydrated);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    if (!hasHydrated || initialRoute !== null) {
      return;
    }

    setInitialRoute(resolveEntryRoute(onboardingStore.getState().isConfirm));
  }, [hasHydrated, initialRoute]);

  const isNavigationReady = hasHydrated && initialRoute !== null;

  usePrefetchNativeCatalogs();
  useNativeTrackingSnapshotSync(isNavigationReady);
  useAppPermissionGuard(navigationRef, isNavigationReady);
  useMonitoringServiceSync(isNavigationReady);

  if (!hasHydrated || initialRoute === null) {
    return <SplashBranding />;
  }

  return <RootNavigator initialRoute={initialRoute} navigationRef={navigationRef} />;
};
