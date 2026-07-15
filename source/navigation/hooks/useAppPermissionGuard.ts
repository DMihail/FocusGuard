/** @format */

import { type RefObject, useCallback, useEffect } from 'react';

import type { NavigationContainerRef } from '@react-navigation/native';

import { areAllPermissionsGranted, invalidatePermissionSnapshot } from '@/domain/permissionSnapshot';
import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
import { onboardingStore } from '@/store/onboardingStore';

import type { RootStackParamList } from '../types';

/**
 * Redirects to Enable Permissions when onboarding is complete but required
 * Android permissions are still missing. Re-checks on navigation ready and app foreground.
 */
export const useAppPermissionGuard = (
  navigationRef: RefObject<NavigationContainerRef<RootStackParamList> | null>,
  isEnabled: boolean,
) => {
  const redirectIfPermissionsMissing = useCallback(() => {
    const { isConfirm } = onboardingStore.getState();

    if (!isConfirm) {
      return;
    }

    const currentRoute = navigationRef.current?.getCurrentRoute()?.name;

    if (currentRoute === 'EnablePermissions') {
      return;
    }

    invalidatePermissionSnapshot();

    if (areAllPermissionsGranted()) {
      return;
    }

    navigationRef.current?.navigate('EnablePermissions');
  }, [navigationRef]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    redirectIfPermissionsMissing();
  }, [isEnabled, redirectIfPermissionsMissing]);

  const handleAppBecomeActive = useCallback(() => {
    if (isEnabled) {
      redirectIfPermissionsMissing();
    }
  }, [isEnabled, redirectIfPermissionsMissing]);

  useAppStateOnActive(handleAppBecomeActive);
};
