/** @format */

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ConfigureLimitsScreen } from '@/screen/ConfigureLimits/ConfigureLimitsScreen';
import { DashboardScreen } from '@/screen/Dashboard/DashboardScreen';
import { EnablePermissionsScreen } from '@/screen/EnablePermissions/EnablePermissionsScreen';
import { LegalDocumentScreen } from '@/screen/Legal/LegalDocumentScreen';
import { ManageAppsScreen } from '@/screen/ManageApps/ManageAppsScreen';
import { OnboardingScreen } from '@/screen/Onboarding/OnboardingScreen';
import { SettingsScreen } from '@/screen/Settings/SettingsScreen';
import { TrackedAppsScreen } from '@/screen/TrackedApps/TrackedAppsScreen';

import { rootScreenTransitionOptions } from './screenTransitionOptions';
import type { RootStackParamList } from './types';

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
