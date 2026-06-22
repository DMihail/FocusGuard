/** @format */

import { useEffect } from 'react';

import {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { PERMISSION_CARD_ANIMATION_MS } from '@/utils/layoutAnimation';

import type { PermissionId, PermissionStatus } from '../types';

const cardTiming = (easing: (value: number) => number) =>
  ({
    duration: PERMISSION_CARD_ANIMATION_MS,
    easing,
  } as const);

/** Drives granted/pending transition styles on the permission card (UI thread). */
export const usePermissionCardAnimation = (permissionId: PermissionId, status: PermissionStatus) => {
  const isGranted = status === 'granted';
  const progress = useSharedValue(isGranted ? 1 : 0);

  useEffect(() => {
    const target = isGranted ? 1 : 0;

    cancelAnimation(progress);

    if (isGranted) {
      progress.value = 1;
      return;
    }

    if (progress.value === target) {
      return;
    }

    progress.value = withTiming(target, cardTiming(Easing.in(Easing.cubic)));
  }, [isGranted, permissionId, progress]);

  const grantedOverlayStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const pendingIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.45, 1], [1, 0, 0]),
  }));

  const grantedIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.55, 1], [0, 0, 1]),
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        scale: interpolate(progress.value, [0, 0.65, 1], [0.4, 1.08, 1]),
      },
    ],
  }));

  const grantButtonStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.35, 1], [1, 0, 0]),
  }));

  return {
    grantedOverlayStyle,
    pendingIconStyle,
    grantedIconStyle,
    badgeStyle,
    grantButtonStyle,
    isGranted,
  };
};
