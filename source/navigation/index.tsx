/** @format */

import { createStaticNavigation } from '@react-navigation/native';
import { RootStack } from './RootStack';

export const Navigation = createStaticNavigation(RootStack);

export { useEnablePermissionsRoute, useOnboardingRoute, useRootNavigation } from './hooks';
export type {
  EnablePermissionsScreenProps,
  OnboardingScreenProps,
  RootNavigationProp,
  RootStackParamList,
} from './types';
export type { RootStackType } from './RootStack';
