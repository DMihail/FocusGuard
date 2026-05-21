/** @format */

import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { colors } from '@/theme';
import { PERMISSION_CARD_ANIMATION_MS, PERMISSION_GRANT_BUTTON_MAX_HEIGHT } from '../constants';
import type { PermissionStatus } from '../types';

export const usePermissionCardAnimation = (status: PermissionStatus) => {
  const isGranted = status === 'granted';
  const progress = useRef(new Animated.Value(isGranted ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: isGranted ? 1 : 0,
      duration: PERMISSION_CARD_ANIMATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [isGranted, progress]);

  return useMemo(() => {
    const cardStyle = {
      backgroundColor: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.card, colors.successMuted],
      }),
      borderColor: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.cardBorder, colors.successBorder],
      }),
    };

    const iconBoxStyle = {
      backgroundColor: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.accentIconBg, colors.successIconBg],
      }),
    };

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

    const grantButtonStyle = {
      opacity: progress.interpolate({
        inputRange: [0, 0.35, 1],
        outputRange: [1, 0, 0],
      }),
      maxHeight: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [PERMISSION_GRANT_BUTTON_MAX_HEIGHT, 0],
      }),
      marginTop: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [8, 0],
      }),
    };

    return {
      cardStyle,
      iconBoxStyle,
      pendingIconOpacity,
      grantedIconOpacity,
      badgeStyle,
      grantButtonStyle,
      isGranted,
    };
  }, [isGranted, progress]);
};
