/** @format */

import { useMemo, useRef, useState } from 'react';
import { Animated, type NativeScrollEvent, type NativeSyntheticEvent, useWindowDimensions } from 'react-native';

import type { FlatList } from 'react-native';

import { useRootNavigation } from '@/navigation';
import { onboardingStore } from '@/store/onboardingStore';

import { WALKTHROUGH_STEPS, type WalkthroughStepData } from '../data/walkthroughSteps';
import type { ScrollIndicatorProps } from '../types';
import { clampStepIndex, createGetItemLayout, createScrollToIndexFailedHandler, getStepFromOffset } from '../utils';

const STEP_COUNT = WALKTHROUGH_STEPS.length;
const LAST_STEP_INDEX = STEP_COUNT - 1;

export const useOnboardingPager = () => {
  const navigation = useRootNavigation();
  const { width: windowWidth } = useWindowDimensions();
  const listRef = useRef<FlatList<WalkthroughStepData>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [step, setStep] = useState(0);
  const [pageWidth, setPageWidth] = useState(windowWidth);

  const isLastStep = step === LAST_STEP_INDEX;
  const isPagerReady = pageWidth > 0;

  const indicatorProps: ScrollIndicatorProps | null = isPagerReady
    ? {
        count: STEP_COUNT,
        scrollX,
        pageWidth,
      }
    : null;

  const handleScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: true,
      }),
    [scrollX],
  );

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextStep = getStepFromOffset(event.nativeEvent.contentOffset.x, pageWidth, LAST_STEP_INDEX);
    setStep(nextStep);
  };

  const goToStep = (index: number) => {
    listRef.current?.scrollToIndex({
      index: clampStepIndex(index, LAST_STEP_INDEX),
      animated: true,
    });
  };

  const onSkip = () => {
    onboardingStore.getState().setIsConfirm(true);
    navigation.navigate('EnablePermissions');
  };

  const handleContinue = () => {
    if (!isLastStep) {
      return goToStep(step + 1);
    }
    onSkip();
  };

  const handlePagerLayout = (width: number) => {
    if (width > 0) {
      setPageWidth((current) => (current === width ? current : width));
    }
  };

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
    onSkip,
  };
};
