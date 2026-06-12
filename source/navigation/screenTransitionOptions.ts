/** @format */

import { Platform } from 'react-native';

import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { colors } from '@/theme';

const IOS_FADE_MS = 320;
const IOS_MODAL_MS = 380;

/** Shared stack defaults — native transitions (not web View Transition API). */
const baseScreenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.background },
  freezeOnBlur: true,
  gestureEnabled: true,
  fullScreenGestureEnabled: Platform.OS === 'ios',
} satisfies NativeStackNavigationOptions;

const fadeTransition = {
  ...baseScreenOptions,
  animation: 'fade',
  ...(Platform.OS === 'ios' ? { animationDuration: IOS_FADE_MS } : {}),
} satisfies NativeStackNavigationOptions;

const pushTransition = {
  ...baseScreenOptions,
  animation: Platform.OS === 'android' ? 'ios_from_right' : 'default',
} satisfies NativeStackNavigationOptions;

const modalTransition = {
  ...baseScreenOptions,
  presentation: 'modal',
  animation: 'slide_from_bottom',
  ...(Platform.OS === 'ios' ? { animationDuration: IOS_MODAL_MS } : {}),
} satisfies NativeStackNavigationOptions;

/** Per-route native stack transition presets for `RootStack`. */
export const rootScreenTransitionOptions = {
  onboarding: fadeTransition,
  enablePermissions: fadeTransition,
  dashboard: fadeTransition,
  manageApps: pushTransition,
  trackedApps: pushTransition,
  configureLimits: pushTransition,
  settings: modalTransition,
  legalDocument: pushTransition,
} as const satisfies Record<string, NativeStackNavigationOptions>;
