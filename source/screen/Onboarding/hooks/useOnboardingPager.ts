/** @format */

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { WALKTHROUGH_STEPS } from '../data/walkthroughSteps';
import type { WalkthroughStepData } from '../data/walkthroughSteps';
import type { ScrollIndicatorProps } from '../types';
import { clampStepIndex, createGetItemLayout, createScrollToIndexFailedHandler, getStepFromOffset } from '../utils';

const STEP_COUNT = WALKTHROUGH_STEPS.length;
const LAST_STEP_INDEX = STEP_COUNT - 1;

export const useOnboardingPager = () => {
  const { width: windowWidth } = useWindowDimensions();
  const listRef = useRef<FlatList<WalkthroughStepData>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [step, setStep] = useState(0);
  const [pageWidth, setPageWidth] = useState(windowWidth);

  const isLastStep = step === LAST_STEP_INDEX;
  const isPagerReady = pageWidth > 0;

  const indicatorProps = useMemo<ScrollIndicatorProps | null>(
    () =>
      isPagerReady
        ? {
            count: STEP_COUNT,
            scrollX,
            pageWidth,
          }
        : null,
    [isPagerReady, pageWidth, scrollX],
  );

  const handleScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: false,
      }),
    [scrollX],
  );

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextStep = getStepFromOffset(event.nativeEvent.contentOffset.x, pageWidth, LAST_STEP_INDEX);
      setStep(nextStep);
    },
    [pageWidth],
  );

  const goToStep = useCallback((index: number) => {
    listRef.current?.scrollToIndex({
      index: clampStepIndex(index, LAST_STEP_INDEX),
      animated: true,
    });
  }, []);

  const handleContinue = useCallback(() => {
    if (!isLastStep) {
      goToStep(step + 1);
    }
  }, [goToStep, isLastStep, step]);

  const handlePagerLayout = useCallback((width: number) => {
    if (width > 0) {
      setPageWidth((current) => (current === width ? current : width));
    }
  }, []);

  const getItemLayout = useMemo(() => createGetItemLayout(pageWidth), [pageWidth]);

  const handleScrollToIndexFailed = useMemo(() => createScrollToIndexFailedHandler(listRef, pageWidth), [pageWidth]);

  return {
    listRef,
    steps: WALKTHROUGH_STEPS,
    step,
    pageWidth,
    isLastStep,
    isPagerReady,
    indicatorProps,
    handleScroll,
    handleMomentumScrollEnd,
    handleContinue,
    handlePagerLayout,
    getItemLayout,
    handleScrollToIndexFailed,
  };
};
