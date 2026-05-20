/** @format */

import { createStaticNavigation } from '@react-navigation/native';
import { RootNavigationGate } from './RootNavigationGate';
import { RootStack } from './RootStack';

export const Navigation = RootNavigationGate;

export const StaticNavigation = createStaticNavigation(RootStack);

export { useEnablePermissionsRoute, useOnboardingRoute, useRootNavigation } from './hooks';
export type {
  EnablePermissionsScreenProps,
  OnboardingScreenProps,
  RootNavigationProp,
  RootStackParamList,
} from './types';
export type { RootStackType } from './RootStack';
