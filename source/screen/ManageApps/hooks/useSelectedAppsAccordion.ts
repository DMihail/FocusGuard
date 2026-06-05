/** @format */

import { useEffect } from 'react';

import { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { SECTION_LAYOUT_ANIMATION_MS } from '@/utils/layoutAnimation';

const expandTiming = {
  duration: SECTION_LAYOUT_ANIMATION_MS,
  easing: Easing.out(Easing.cubic),
} as const;

const collapseTiming = {
  duration: SECTION_LAYOUT_ANIMATION_MS,
  easing: Easing.in(Easing.cubic),
} as const;

/** Smooth height + opacity accordion for the selected-apps strip. */
export const useSelectedAppsAccordion = (isExpanded: boolean, expandedHeight: number) => {
  const animatedHeight = useSharedValue(isExpanded ? expandedHeight : 0);

  useEffect(() => {
    animatedHeight.value = withTiming(isExpanded ? expandedHeight : 0, isExpanded ? expandTiming : collapseTiming);
  }, [animatedHeight, expandedHeight, isExpanded]);

  return useAnimatedStyle(() => ({
    height: animatedHeight.value,
    opacity: interpolate(animatedHeight.value, [0, expandedHeight], [0, 1]),
    overflow: 'hidden',
  }));
};
