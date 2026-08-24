/** @format */

import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import type { NavigationContainerRef } from '@react-navigation/native';
import Animated from 'react-native-reanimated';

import { CoreStoresHydrationProvider, useCoreStoresHydrated } from '@/context/CoreStoresHydrationProvider';
import { SelectedDashboardAppRowsProvider } from '@/context/SelectedDashboardAppRowsProvider';
import { usePrefetchNativeCatalogs } from '@/hooks/usePrefetchNativeCatalogs';
import { onboardingStore } from '@/store';
import { startNativeMonitoringSnapshotSync } from '@/store/nativeMonitoringSnapshot';
import { startNativeSettingsSnapshotSync } from '@/store/nativeSettingsSnapshot';
import { startNativeTrackingSnapshotSync } from '@/store/nativeTrackingSnapshot';

import { useAppPermissionGuard } from './hooks/useAppPermissionGuard';
import { useMonitoringServiceSync } from './hooks/useMonitoringServiceSync';
import { useSplashHandoff } from './hooks/useSplashHandoff';
import { resolveEntryRoute } from './resolveEntryRoute';
import { RootNavigator } from './RootNavigator';
import type { RootStackParamList } from './types';

import { GlobalUsageHistorySync, SplashBranding } from '@/components';

export const RootNavigationGate = () => (
  <CoreStoresHydrationProvider>
    <RootNavigationGateContent />
  </CoreStoresHydrationProvider>
);

const RootNavigationGateContent = () => {
  const hasCoreStoresHydrated = useCoreStoresHydrated();
  const isOnboardingComplete = onboardingStore((state) => state.isConfirm);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const initialRoute = hasCoreStoresHydrated ? resolveEntryRoute(isOnboardingComplete) : null;
  const isNavigationReady = initialRoute !== null;
  const { isSplashVisible, splashOverlayStyle } = useSplashHandoff(isNavigationReady);

  usePrefetchNativeCatalogs();

  useEffect(() => {
    if (!isNavigationReady) {
      return;
    }

    const stopTracking = startNativeTrackingSnapshotSync();
    const stopMonitoring = startNativeMonitoringSnapshotSync();
    const stopSettings = startNativeSettingsSnapshotSync();

    return () => {
      stopTracking();
      stopMonitoring();
      stopSettings();
    };
  }, [isNavigationReady]);

  useAppPermissionGuard(navigationRef, isNavigationReady);
  useMonitoringServiceSync(isNavigationReady);

  return (
    <View style={styles.root}>
      {isNavigationReady && initialRoute ? (
        <SelectedDashboardAppRowsProvider>
          <GlobalUsageHistorySync />
          <RootNavigator initialRoute={initialRoute} navigationRef={navigationRef} />
        </SelectedDashboardAppRowsProvider>
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
