/** @format */

import { type ComponentRef, useCallback, useMemo, useRef } from 'react';

import type { LayoutChangeEvent, View } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

import { sliderValueFromPosition } from '../utils/sliderValueFromPosition';

type SliderGestureParams = {
  valueMinutes: number;
  minMinutes: number;
  progressMinMinutes: number;
  maxMinutes: number;
  stepMinutes: number;
  onChange: (minutes: number) => void;
};

/** Pan gesture for the limit slider track (UI thread + relative coordinates). */
export const useSliderTrackGesture = ({
  valueMinutes,
  minMinutes,
  progressMinMinutes,
  maxMinutes,
  stepMinutes,
  onChange,
}: SliderGestureParams) => {
  const trackRef = useRef<ComponentRef<typeof View>>(null);
  const widthRef = useRef(0);
  const paramsRef = useRef<SliderGestureParams>({
    valueMinutes,
    minMinutes,
    progressMinMinutes,
    maxMinutes,
    stepMinutes,
    onChange,
  });

  paramsRef.current = {
    valueMinutes,
    minMinutes,
    progressMinMinutes,
    maxMinutes,
    stepMinutes,
    onChange,
  };

  const applyRelativeX = useCallback((x: number) => {
    const params = paramsRef.current;
    const width = widthRef.current;

    if (width <= 0) {
      return;
    }

    const next = sliderValueFromPosition(
      x,
      width,
      params.minMinutes,
      params.maxMinutes,
      params.stepMinutes,
      params.progressMinMinutes,
    );

    if (next !== params.valueMinutes) {
      params.onChange(next);
    }
  }, []);

  const handleTrackLayout = useCallback((event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;

    if (width > 0) {
      widthRef.current = width;
    }
  }, []);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0)
        .onBegin((event) => {
          runOnJS(applyRelativeX)(event.x);
        })
        .onUpdate((event) => {
          runOnJS(applyRelativeX)(event.x);
        }),
    [applyRelativeX],
  );

  return {
    trackRef,
    panGesture,
    handleTrackLayout,
  };
};
