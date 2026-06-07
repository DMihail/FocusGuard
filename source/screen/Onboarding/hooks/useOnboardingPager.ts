/** @format */

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  useWindowDimensions,
} from 'react-native';

import type { FlatList } from 'react-native';
import { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import { prefetchInstalledApps } from '@/domain/installedAppsCatalog';
import { prefetchUsageStats } from '@/domain/usageStatsCatalog';
import { useRootNavigation } from '@/navigation';
import { onboardingStore } from '@/store/onboardingStore';

import { WALKTHROUGH_STEPS, type WalkthroughStepData } from '../data/walkthroughSteps';
import type { ScrollIndicatorProps } from '../types';
import {
  clampStepIndex,
  createGetItemLayout,
  createScrollToIndexFailedHandler,
  getStepFromOffset,
} from '../utils/scroll';

const STEP_COUNT = WALKTHROUGH_STEPS.length;
const LAST_STEP_INDEX = STEP_COUNT - 1;

export const useOnboardingPager = () => {
  const navigation = useRootNavigation();
  const { width: windowWidth } = useWindowDimensions();
  const listRef = useRef<FlatList<WalkthroughStepData>>(null);
  const scrollX = useSharedValue(0);
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

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

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

  const onSkip = useCallback(() => {
    onboardingStore.getState().setIsConfirm(true);
    prefetchInstalledApps();
    prefetchUsageStats();
    navigation.navigate('EnablePermissions');
  }, [navigation]);

  const handleContinue = useCallback(() => {
    if (!isLastStep) {
      goToStep(step + 1);
      return;
    }

    onSkip();
  }, [goToStep, isLastStep, onSkip, step]);

  const handlePagerContainerLayout = useCallback(({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    if (layout.width > 0) {
      setPageWidth((current) => (current === layout.width ? current : layout.width));
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
    handlePagerContainerLayout,
    getItemLayout,
    handleScrollToIndexFailed,
    onSkip,
  };
};
