/** @format */

import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import type { NavigationContainerRef } from '@react-navigation/native';
import Animated from 'react-native-reanimated';

import { invalidatePermissionSnapshot } from '@/domain/permissionSnapshot';
import { useCoreStoresHydrated } from '@/hooks/useCoreStoresHydrated';
import { useGlobalUsageHistorySync } from '@/hooks/useGlobalUsageHistorySync';
import { usePrefetchNativeCatalogs } from '@/hooks/usePrefetchNativeCatalogs';
import { onboardingStore } from '@/store';
import { startNativeTrackingSnapshotSync } from '@/store/nativeTrackingSnapshot';

import { useAppPermissionGuard } from './hooks/useAppPermissionGuard';
import { useMonitoringServiceSync } from './hooks/useMonitoringServiceSync';
import { useSplashHandoff } from './hooks/useSplashHandoff';
import { resolveEntryRoute } from './resolveEntryRoute';
import { RootNavigator } from './RootNavigator';
import type { RootStackParamList } from './types';

import { SplashBranding } from '@/components';

export const RootNavigationGate = () => {
  const hasCoreStoresHydrated = useCoreStoresHydrated();
  const isOnboardingComplete = onboardingStore((state) => state.isConfirm);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const initialRoute = hasCoreStoresHydrated ? resolveEntryRoute(isOnboardingComplete) : null;
  const isNavigationReady = initialRoute !== null;
  const { isSplashVisible, splashOverlayStyle } = useSplashHandoff(isNavigationReady);

  usePrefetchNativeCatalogs();
  useGlobalUsageHistorySync(isNavigationReady);

  useEffect(() => {
    if (!isNavigationReady) {
      return;
    }

    invalidatePermissionSnapshot();

    return startNativeTrackingSnapshotSync();
  }, [isNavigationReady]);

  useAppPermissionGuard(navigationRef, isNavigationReady);
  useMonitoringServiceSync(isNavigationReady);

  return (
    <View style={styles.root}>
      {isNavigationReady && initialRoute ? (
        <RootNavigator initialRoute={initialRoute} navigationRef={navigationRef} />
      ) : null}

      {isSplashVisible ? (
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
