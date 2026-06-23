/** @format */

import { useCallback, useEffect, useRef } from 'react';

import { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { SELECTED_APPS_ACCORDION_OPEN_SPRING, SELECTED_APPS_ACCORDION_SPRING } from '../constants';

/** Smooth height accordion for the selected-apps strip. */
export const useSelectedAppsAccordion = (isExpanded: boolean, expandedHeight: number, onCollapseEnd?: () => void) => {
  const progress = useSharedValue(isExpanded ? 1 : 0);
  const expandedHeightValue = useSharedValue(expandedHeight);
  const wasExpandedRef = useRef(isExpanded);
  const onCollapseEndRef = useRef(onCollapseEnd);

  useEffect(() => {
    onCollapseEndRef.current = onCollapseEnd;
  }, [onCollapseEnd]);

  const notifyCollapseEnd = useCallback(() => {
    onCollapseEndRef.current?.();
  }, []);

  useEffect(() => {
    const wasExpanded = wasExpandedRef.current;
    wasExpandedRef.current = isExpanded;

    if (isExpanded && !wasExpanded) {
      expandedHeightValue.value = expandedHeight;
      progress.value = withSpring(1, SELECTED_APPS_ACCORDION_OPEN_SPRING);
      return;
    }

    if (!isExpanded && wasExpanded) {
      progress.value = withSpring(0, SELECTED_APPS_ACCORDION_SPRING, (finished) => {
        'worklet';

        if (finished) {
          runOnJS(notifyCollapseEnd)();
        }
      });
      return;
    }

    if (!isExpanded) {
      expandedHeightValue.value = expandedHeight;
      return;
    }

    if (expandedHeight !== expandedHeightValue.value) {
      expandedHeightValue.value = withSpring(expandedHeight, SELECTED_APPS_ACCORDION_SPRING);
    }
  }, [expandedHeight, expandedHeightValue, isExpanded, notifyCollapseEnd, progress]);

  return useAnimatedStyle(() => ({
    height: interpolate(progress.value, [0, 1], [0, expandedHeightValue.value]),
    overflow: 'hidden',
  }));
};
