/** @format */

import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import {
  DashboardScreenProps,
  EnablePermissionsScreenProps,
  OnboardingScreenProps,
  RootNavigationProp,
  RootStackParamList,
} from './types';

export const useRootNavigation = (): RootNavigationProp => useNavigation<RootNavigationProp>();

export const useOnboardingRoute = (): OnboardingScreenProps['route'] =>
  useRoute<RouteProp<RootStackParamList, 'Onboarding'>>();

export const useEnablePermissionsRoute = (): EnablePermissionsScreenProps['route'] =>
  useRoute<RouteProp<RootStackParamList, 'EnablePermissions'>>();

export const useDashboardRoute = (): DashboardScreenProps['route'] =>
  useRoute<RouteProp<RootStackParamList, 'Dashboard'>>();
