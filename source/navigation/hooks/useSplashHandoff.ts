/** @format */

import { useEffect, useState } from 'react';

import { runOnJS, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

const SPLASH_FADE_MS = 360;

type SplashHandoffResult = {
  isSplashVisible: boolean;
  splashOverlayStyle: ReturnType<typeof useAnimatedStyle>;
};

/** Keeps splash visible until navigation is ready, then crossfades it out. */
export const useSplashHandoff = (isNavigationReady: boolean): SplashHandoffResult => {
  const isReducedMotion = useReducedMotion();
  const [isFadeComplete, setIsFadeComplete] = useState(false);
  const splashOpacity = useSharedValue(1);
  const isSplashVisible = !isNavigationReady || !isFadeComplete;

  useEffect(() => {
    if (!isNavigationReady) {
      setIsFadeComplete(false);
      splashOpacity.value = 1;
      return;
    }

    if (isReducedMotion) {
      splashOpacity.value = 0;
      setIsFadeComplete(true);
      return;
    }

    splashOpacity.value = 1;
    splashOpacity.value = withTiming(0, { duration: SPLASH_FADE_MS }, (finished) => {
      if (finished) {
        runOnJS(setIsFadeComplete)(true);
      }
    });
  }, [isNavigationReady, isReducedMotion, splashOpacity]);

  const splashOverlayStyle = useAnimatedStyle(() => ({
    opacity: isNavigationReady ? splashOpacity.value : 1,
  }));

  return {
    isSplashVisible,
    splashOverlayStyle,
  };
};
