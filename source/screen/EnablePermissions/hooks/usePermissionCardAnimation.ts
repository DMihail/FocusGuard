/** @format */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, LayoutAnimation } from 'react-native';

import { PERMISSION_CARD_ANIMATION_MS } from '../constants';
import type { PermissionStatus } from '../types';

const LAYOUT_ANIM_CONFIG = {
  duration: PERMISSION_CARD_ANIMATION_MS,
  update: { type: LayoutAnimation.Types.easeOut, property: LayoutAnimation.Properties.scaleY },
  delete: { type: LayoutAnimation.Types.easeOut, property: LayoutAnimation.Properties.opacity },
};

export const usePermissionCardAnimation = (status: PermissionStatus) => {
  const isGranted = status === 'granted';
  const progress = useRef(new Animated.Value(isGranted ? 1 : 0)).current;
  const [collapsed, setCollapsed] = useState(isGranted);

  useEffect(() => {
    const target = isGranted ? 1 : 0;

    LayoutAnimation.configureNext(LAYOUT_ANIM_CONFIG);
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
