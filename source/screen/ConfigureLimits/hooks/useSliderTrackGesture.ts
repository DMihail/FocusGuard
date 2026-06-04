/** @format */

import { useCallback, useRef } from 'react';
import { PanResponder, type View } from 'react-native';

import { sliderValueFromPosition } from '../utils/sliderValueFromPosition';

type TrackMetrics = {
  width: number;
  pageX: number;
};

type SliderGestureParams = {
  valueMinutes: number;
  minMinutes: number;
  progressMinMinutes: number;
  maxMinutes: number;
  stepMinutes: number;
  onChange: (minutes: number) => void;
};

export const useSliderTrackGesture = ({
  valueMinutes,
  minMinutes,
  progressMinMinutes,
  maxMinutes,
  stepMinutes,
  onChange,
}: SliderGestureParams) => {
  const trackRef = useRef<View>(null);
  const metricsRef = useRef<TrackMetrics>({ width: 0, pageX: 0 });
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

  const applyPageX = useCallback((pageX: number) => {
    const params = paramsRef.current;
    const { width, pageX: trackPageX } = metricsRef.current;

    if (width <= 0) {
      return;
    }

    const positionX = pageX - trackPageX;
    const next = sliderValueFromPosition(
      positionX,
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

  const syncTrackMetrics = useCallback(() => {
    trackRef.current?.measureInWindow((pageX, _y, width) => {
      if (width > 0) {
        metricsRef.current = { pageX, width };
      }
    });
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (event) => {
        syncTrackMetrics();
        applyPageX(event.nativeEvent.pageX);
      },
      onPanResponderMove: (event) => {
        applyPageX(event.nativeEvent.pageX);
      },
    }),
  ).current;

  return {
    trackRef,
    panHandlers: panResponder.panHandlers,
    syncTrackMetrics,
  };
};
