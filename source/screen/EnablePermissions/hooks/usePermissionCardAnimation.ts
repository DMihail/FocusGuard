/** @format */

import { useEffect, useState } from 'react';

import { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { configurePermissionCardLayoutAnimation, PERMISSION_CARD_ANIMATION_MS } from '@/utils/layoutAnimation';

import type { PermissionStatus } from '../types';

/** Drives granted/pending transition styles on the permission card (UI thread). */
export const usePermissionCardAnimation = (status: PermissionStatus) => {
  const isGranted = status === 'granted';
  const progress = useSharedValue(isGranted ? 1 : 0);
  const [collapsed, setCollapsed] = useState(isGranted);

  useEffect(() => {
    const target = isGranted ? 1 : 0;

    configurePermissionCardLayoutAnimation();
    setCollapsed(isGranted);

    progress.value = withTiming(target, {
      duration: PERMISSION_CARD_ANIMATION_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [isGranted, progress]);

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
    collapsed,
    isGranted,
  };
};
