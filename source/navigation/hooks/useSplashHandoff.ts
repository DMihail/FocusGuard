/** @format */

import { useEffect, useState } from 'react';

import { runOnJS, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

const SPLASH_FADE_MS = 360;

type SplashHandoffResult = {
  showSplashOverlay: boolean;
  splashOverlayStyle: ReturnType<typeof useAnimatedStyle>;
};

/** Crossfades the splash branding out once navigation is ready to mount. */
export const useSplashHandoff = (isNavigationReady: boolean): SplashHandoffResult => {
  const isReducedMotion = useReducedMotion();
  const [showSplashOverlay, setShowSplashOverlay] = useState(false);
  const splashOpacity = useSharedValue(1);

  useEffect(() => {
    if (!isNavigationReady) {
      setShowSplashOverlay(false);
      splashOpacity.value = 1;
      return;
    }

    setShowSplashOverlay(true);

    if (isReducedMotion) {
      setShowSplashOverlay(false);
      splashOpacity.value = 0;
      return;
    }

    splashOpacity.value = withTiming(0, { duration: SPLASH_FADE_MS }, (finished) => {
      if (finished) {
        runOnJS(setShowSplashOverlay)(false);
      }
    });
  }, [isNavigationReady, isReducedMotion, splashOpacity]);

  const splashOverlayStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
  }));

  return {
    showSplashOverlay,
    splashOverlayStyle,
  };
};
