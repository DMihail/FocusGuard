/** @format */

import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

const baseScreenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: 'transparent' },
  freezeOnBlur: true,
  gestureEnabled: true,
  fullScreenGestureEnabled: false,
} satisfies NativeStackNavigationOptions;

const fadeTransition = {
  ...baseScreenOptions,
  animation: 'fade',
} satisfies NativeStackNavigationOptions;

const pushTransition = {
  ...baseScreenOptions,
  animation: 'ios_from_right',
} satisfies NativeStackNavigationOptions;

const modalTransition = {
  ...baseScreenOptions,
  presentation: 'modal',
  animation: 'slide_from_bottom',
} satisfies NativeStackNavigationOptions;

/** Per-route native stack transition presets for `RootStack`. */
export const rootScreenTransitionOptions = {
  onboarding: fadeTransition,
  enablePermissions: fadeTransition,
  dashboard: fadeTransition,
  manageApps: pushTransition,
  trackedApps: pushTransition,
  statistics: pushTransition,
  configureLimits: pushTransition,
  settings: modalTransition,
  legalDocument: pushTransition,
} as const satisfies Record<string, NativeStackNavigationOptions>;
