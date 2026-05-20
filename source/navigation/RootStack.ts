/** @format */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen, EnablePermissionsScreen, OnboardingScreen } from '../screen';
import type { RootStackParamList } from './types';

const rootScreens = {
  Onboarding: {
    screen: OnboardingScreen,
    options: {
      headerShown: false,
    },
  },
  EnablePermissions: {
    screen: EnablePermissionsScreen,
    options: {
      headerShown: false,
    },
  },
  Dashboard: {
    screen: DashboardScreen,
    options: {
      headerShown: false,
    },
  },
} as const;

export const createRootStack = (initialRouteName: keyof RootStackParamList) =>
  createNativeStackNavigator({
    initialRouteName,
    screens: rootScreens,
  });

export const RootStack = createRootStack('Onboarding');

export type RootStackType = typeof RootStack;

declare module '@react-navigation/core' {
  interface RootNavigator extends RootStackType {}
}
