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

import { useTranslation } from '@/i18n';
import { useRootNavigation } from '@/navigation';
import { onboardingStore } from '@/store/onboardingStore';

import { createWalkthroughSteps, type WalkthroughStepData } from '../data/walkthroughSteps';
import type { ScrollIndicatorProps } from '../types';
import {
  clampStepIndex,
  createGetItemLayout,
  createScrollToIndexFailedHandler,
  getStepFromOffset,
} from '../utils/scroll';

export const useOnboardingPager = () => {
  const { t } = useTranslation();
  const navigation = useRootNavigation();
  const { width: windowWidth } = useWindowDimensions();
  const listRef = useRef<FlatList<WalkthroughStepData>>(null);
  const scrollX = useSharedValue(0);
  const [step, setStep] = useState(0);
  const [pageWidth, setPageWidth] = useState(windowWidth);
  const steps = useMemo(() => createWalkthroughSteps(t), [t]);
  const stepCount = steps.length;
  const lastStepIndex = stepCount - 1;

  const isLastStep = step === lastStepIndex;
  const isPagerReady = pageWidth > 0;

  const indicatorProps = useMemo<ScrollIndicatorProps | null>(
    () =>
      isPagerReady
        ? {
            count: stepCount,
            scrollX,
            pageWidth,
          }
        : null,
    [isPagerReady, pageWidth, scrollX, stepCount],
  );

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextStep = getStepFromOffset(event.nativeEvent.contentOffset.x, pageWidth, lastStepIndex);
      setStep(nextStep);
    },
    [lastStepIndex, pageWidth],
  );

  const goToStep = useCallback(
    (index: number) => {
      listRef.current?.scrollToIndex({
        index: clampStepIndex(index, lastStepIndex),
        animated: true,
      });
    },
    [lastStepIndex],
  );

  const onSkip = useCallback(() => {
    onboardingStore.getState().setIsConfirm(true);
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
    steps,
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
