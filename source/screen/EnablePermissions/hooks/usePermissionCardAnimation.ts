/** @format */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

import { configurePermissionCardLayoutAnimation, PERMISSION_CARD_ANIMATION_MS } from '@/utils/layoutAnimation';

import type { PermissionStatus } from '../types';

export const usePermissionCardAnimation = (status: PermissionStatus) => {
  const isGranted = status === 'granted';
  const progress = useRef(new Animated.Value(isGranted ? 1 : 0)).current;
  const [collapsed, setCollapsed] = useState(isGranted);

  useEffect(() => {
    const target = isGranted ? 1 : 0;

    configurePermissionCardLayoutAnimation();
    setCollapsed(isGranted);

    Animated.timing(progress, {
      toValue: target,
      duration: PERMISSION_CARD_ANIMATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isGranted, progress]);

  return useMemo(() => {
    const grantedOverlayOpacity = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const pendingIconOpacity = progress.interpolate({
      inputRange: [0, 0.45, 1],
      outputRange: [1, 0, 0],
    });

    const grantedIconOpacity = progress.interpolate({
      inputRange: [0, 0.55, 1],
      outputRange: [0, 0, 1],
    });

    const badgeStyle = {
      opacity: progress,
      transform: [
        {
          scale: progress.interpolate({
            inputRange: [0, 0.65, 1],
            outputRange: [0.4, 1.08, 1],
          }),
        },
      ],
    };

    const grantButtonOpacity = progress.interpolate({
      inputRange: [0, 0.35, 1],
      outputRange: [1, 0, 0],
    });

    return {
      grantedOverlayOpacity,
      pendingIconOpacity,
      grantedIconOpacity,
      badgeStyle,
      grantButtonOpacity,
      collapsed,
      isGranted,
    };
  }, [collapsed, isGranted, progress]);
};
