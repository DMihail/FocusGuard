/** @format */

import { Animated } from 'react-native';

export const createIndicatorProgress = (
  scrollX: Animated.Value,
  index: number,
  pageWidth: number,
): Animated.AnimatedInterpolation<number> => {
  if (pageWidth <= 0) {
    return scrollX.interpolate({
      inputRange: [0, 1],
      outputRange: [index === 0 ? 1 : 0, index === 0 ? 1 : 0],
    });
  }

  return scrollX.interpolate({
    inputRange: [(index - 1) * pageWidth, index * pageWidth, (index + 1) * pageWidth],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });
};
