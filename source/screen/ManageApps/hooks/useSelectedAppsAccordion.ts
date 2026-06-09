/** @format */

import { useEffect } from 'react';

import { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { SELECTED_APPS_ACCORDION_SPRING } from '../constants';

/** Smooth height + opacity accordion for the selected-apps strip. */
export const useSelectedAppsAccordion = (isExpanded: boolean, expandedHeight: number, onCollapseEnd?: () => void) => {
  const progress = useSharedValue(isExpanded ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(isExpanded ? 1 : 0, SELECTED_APPS_ACCORDION_SPRING, (finished) => {
      'worklet';

      if (finished && !isExpanded && onCollapseEnd) {
        runOnJS(onCollapseEnd)();
      }
    });
  }, [expandedHeight, isExpanded, onCollapseEnd, progress]);

  return useAnimatedStyle(() => ({
    height: interpolate(progress.value, [0, 1], [0, expandedHeight]),
    opacity: interpolate(progress.value, [0, 0.55, 1], [0, 0.92, 1], 'clamp'),
    overflow: 'hidden',
  }));
};
