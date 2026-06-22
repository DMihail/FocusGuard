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
import { darkColors } from '@/theme';
import type { ColorPalette } from '@/theme/types';

import { createRootScreenTransitionOptions } from './screenTransitionOptions';
import type { RootStackParamList } from './types';

const createRootScreens = (colors: ColorPalette) => {
  const rootScreenTransitionOptions = createRootScreenTransitionOptions(colors);

  return {
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
  } as const;
};

export const createRootStack = (initialRouteName: keyof RootStackParamList, colors: ColorPalette = darkColors) =>
  createNativeStackNavigator({
    initialRouteName,
    screens: createRootScreens(colors),
  });

export const RootStack = createRootStack('Onboarding');

export type RootStackType = typeof RootStack;

declare module '@react-navigation/core' {
  interface RootNavigator extends RootStackType {}
}
