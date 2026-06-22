/** @format */

import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { colors as defaultColors } from '@/theme';
import type { ColorPalette } from '@/theme/types';

const IOS_FADE_MS = 320;
const IOS_MODAL_MS = 380;

/** Per-route native stack transition presets for `RootStack`. */
export const createRootScreenTransitionOptions = (colors: ColorPalette = defaultColors) => {
  const baseScreenOptions = {
    headerShown: false,
    contentStyle: { backgroundColor: colors.background },
    freezeOnBlur: true,
    gestureEnabled: true,
    fullScreenGestureEnabled: true,
  } satisfies NativeStackNavigationOptions;

  const fadeTransition = {
    ...baseScreenOptions,
    animation: 'fade',
    animationDuration: IOS_FADE_MS,
  } satisfies NativeStackNavigationOptions;

  const pushTransition = {
    ...baseScreenOptions,
    animation: 'default',
  } satisfies NativeStackNavigationOptions;

  const modalTransition = {
    ...baseScreenOptions,
    presentation: 'modal',
    animation: 'slide_from_bottom',
    animationDuration: IOS_MODAL_MS,
  } satisfies NativeStackNavigationOptions;

  return {
    onboarding: fadeTransition,
    enablePermissions: fadeTransition,
    dashboard: fadeTransition,
    manageApps: pushTransition,
    trackedApps: pushTransition,
    configureLimits: pushTransition,
    settings: modalTransition,
    legalDocument: pushTransition,
  } as const satisfies Record<string, NativeStackNavigationOptions>;
};
