/** @format */

import { useEffect, type RefObject } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import type { NavigationContainerRef } from '@react-navigation/native';
import { areAllPermissionsGranted } from '@/screen/EnablePermissions/utils/permissionStatus';
import { onboardingStore } from '@/store/onboardingStore';
import type { RootStackParamList } from '../types';

export const useAppPermissionGuard = (
  navigationRef: RefObject<NavigationContainerRef<RootStackParamList> | null>,
  isEnabled: boolean,
) => {
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const redirectIfPermissionsMissing = () => {
      const { isConfirm } = onboardingStore.getState();

      if (!isConfirm || areAllPermissionsGranted()) {
        return;
      }

      const currentRoute = navigationRef.current?.getCurrentRoute()?.name;

      if (currentRoute !== 'EnablePermissions') {
        navigationRef.current?.navigate('EnablePermissions');
      }
    };

    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        redirectIfPermissionsMissing();
      }
    };

    redirectIfPermissionsMissing();

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [isEnabled, navigationRef]);
};
