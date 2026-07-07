/** @format */

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DashboardScreen } from '@/screen/Dashboard/DashboardScreen';
import { EnablePermissionsScreen } from '@/screen/EnablePermissions/EnablePermissionsScreen';
import { OnboardingScreen } from '@/screen/Onboarding/OnboardingScreen';

import {
  ConfigureLimitsScreen,
  LegalDocumentScreen,
  ManageAppsScreen,
  SettingsScreen,
  StatisticsScreen,
  TrackedAppsScreen,
} from './lazyScreens';
import { rootScreenTransitionOptions } from './screenTransitionOptions';
import type { RootStackParamList } from './types';

/**
 * Eager screens (Onboarding, EnablePermissions, Dashboard) stay in the main bundle — they are
 * entry routes or the primary hub. All other stack screens are lazy-loaded on first navigation.
 */
const createRootScreens = () =>
  ({
    Onboarding: {
      screen: OnboardingScreen,
      options: rootScreenTransitionOptions.onboarding,
    },
    EnablePermissions: {
      screen: EnablePermissionsScreen,
      options: rootScreenTransitionOptions.enablePermissions,
    },
    Dashboard: {
      screen: DashboardScreen,
      options: rootScreenTransitionOptions.dashboard,
    },
    ManageApps: {
      screen: ManageAppsScreen,
      options: rootScreenTransitionOptions.manageApps,
    },
    TrackedApps: {
      screen: TrackedAppsScreen,
      options: rootScreenTransitionOptions.trackedApps,
    },
    Statistics: {
      screen: StatisticsScreen,
      options: rootScreenTransitionOptions.statistics,
    },
    ConfigureLimits: {
      screen: ConfigureLimitsScreen,
      options: rootScreenTransitionOptions.configureLimits,
    },
    Settings: {
      screen: SettingsScreen,
      options: rootScreenTransitionOptions.settings,
    },
    LegalDocument: {
      screen: LegalDocumentScreen,
      options: rootScreenTransitionOptions.legalDocument,
    },
  } as const);

export const createRootStack = (initialRouteName: keyof RootStackParamList) =>
  createNativeStackNavigator({
    initialRouteName,
    screens: createRootScreens(),
  });

export const RootStack = createRootStack('Onboarding');

export type RootStackType = typeof RootStack;

declare module '@react-navigation/core' {
  interface RootNavigator extends RootStackType {}
}
