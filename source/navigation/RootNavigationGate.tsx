/** @format */

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { NavigationContainerRef } from '@react-navigation/native';
import Animated from 'react-native-reanimated';

import { useNativeTrackingSnapshotSync } from '@/hooks/useNativeTrackingSnapshotSync';
import { usePrefetchNativeCatalogs } from '@/hooks/usePrefetchNativeCatalogs';
import { onboardingStore } from '@/store';

import { useAppPermissionGuard } from './hooks/useAppPermissionGuard';
import { useMonitoringServiceSync } from './hooks/useMonitoringServiceSync';
import { useSplashHandoff } from './hooks/useSplashHandoff';
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
  const { showSplashOverlay, splashOverlayStyle } = useSplashHandoff(isNavigationReady);

  usePrefetchNativeCatalogs();
  useNativeTrackingSnapshotSync(isNavigationReady);
  useAppPermissionGuard(navigationRef, isNavigationReady);
  useMonitoringServiceSync(isNavigationReady);

  if (!isNavigationReady || initialRoute === null) {
    return <SplashBranding />;
  }

  return (
    <View style={styles.root}>
      <RootNavigator initialRoute={initialRoute} navigationRef={navigationRef} />

      {showSplashOverlay ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.splashOverlay, splashOverlayStyle]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <SplashBranding />
        </Animated.View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },
});
