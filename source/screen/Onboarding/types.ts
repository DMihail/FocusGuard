/** @format */

import type { Animated } from 'react-native';

export type ScrollIndicatorProps = {
  count: number;
  scrollX: Animated.Value;
  pageWidth: number;
};
