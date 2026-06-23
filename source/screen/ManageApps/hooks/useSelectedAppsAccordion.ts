/** @format */

import { useCallback, useEffect, useRef } from 'react';

import { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { SELECTED_APPS_ACCORDION_SPRING } from '../constants';

/** Smooth height + opacity accordion for the selected-apps strip. */
export const useSelectedAppsAccordion = (isExpanded: boolean, expandedHeight: number, onCollapseEnd?: () => void) => {
  const progress = useSharedValue(isExpanded ? 1 : 0);
  const expandedHeightValue = useSharedValue(expandedHeight);
  const onCollapseEndRef = useRef(onCollapseEnd);

  useEffect(() => {
    onCollapseEndRef.current = onCollapseEnd;
  }, [onCollapseEnd]);

  const notifyCollapseEnd = useCallback(() => {
    onCollapseEndRef.current?.();
  }, []);

  useEffect(() => {
    if (isExpanded) {
      expandedHeightValue.value = withSpring(expandedHeight, SELECTED_APPS_ACCORDION_SPRING);
      return;
    }

    expandedHeightValue.value = expandedHeight;
  }, [expandedHeight, expandedHeightValue, isExpanded]);

  useEffect(() => {
    progress.value = withSpring(isExpanded ? 1 : 0, SELECTED_APPS_ACCORDION_SPRING, (finished) => {
      'worklet';

      if (finished && !isExpanded) {
        runOnJS(notifyCollapseEnd)();
      }
    });
  }, [isExpanded, notifyCollapseEnd, progress]);

  return useAnimatedStyle(() => ({
    height: interpolate(progress.value, [0, 1], [0, expandedHeightValue.value]),
    opacity: interpolate(progress.value, [0, 0.55, 1], [0, 0.92, 1], 'clamp'),
    overflow: 'hidden',
  }));
};
