/** @format */

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  ConfigureLimitsScreen,
  DashboardScreen,
  EnablePermissionsScreen,
  LegalDocumentScreen,
  ManageAppsScreen,
  OnboardingScreen,
  SettingsScreen,
  TrackedAppsScreen,
} from '@/screen';

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
    linking: 'dashboard',
    options: {
      headerShown: false,
    },
  },
  ManageApps: {
    screen: ManageAppsScreen,
    options: {
      headerShown: false,
    },
  },
  TrackedApps: {
    screen: TrackedAppsScreen,
    options: {
      headerShown: false,
    },
  },
  ConfigureLimits: {
    screen: ConfigureLimitsScreen,
    linking: 'configure/:packageName',
    options: {
      headerShown: false,
    },
  },
  Settings: {
    screen: SettingsScreen,
    options: {
      headerShown: false,
    },
  },
  LegalDocument: {
    screen: LegalDocumentScreen,
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
