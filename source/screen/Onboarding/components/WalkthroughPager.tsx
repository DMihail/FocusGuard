/** @format */

import React, { type RefObject, useMemo } from 'react';
import { FlatList, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

import Animated, { type ScrollHandlerProcessed } from 'react-native-reanimated';

import { keyById as walkthroughStepKeyExtractor } from '@/list/keys';
import { testIds } from '@/testing/testIds';

import { FLAT_LIST_WINDOW_SIZE, SCROLL_EVENT_THROTTLE } from '../constants';
import type { WalkthroughStepData } from '../data/walkthroughSteps';
import { createWalkthroughPageRenderItem } from '../list/renderers';

const ReanimatedFlatList = Animated.createAnimatedComponent(FlatList<WalkthroughStepData>);

type WalkthroughPagerProps = {
  listRef: RefObject<FlatList<WalkthroughStepData> | null>;
  steps: WalkthroughStepData[];
  pageWidth: number;
  onScroll: ScrollHandlerProcessed;
  onMomentumScrollEnd: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  getItemLayout: NonNullable<FlatList<WalkthroughStepData>['props']['getItemLayout']>;
  onScrollToIndexFailed: NonNullable<FlatList<WalkthroughStepData>['props']['onScrollToIndexFailed']>;
};

export const WalkthroughPager = ({
  listRef,
  steps,
  pageWidth,
  onScroll,
  onMomentumScrollEnd,
  getItemLayout,
  onScrollToIndexFailed,
}: WalkthroughPagerProps) => {
  const renderItem = useMemo(() => createWalkthroughPageRenderItem(pageWidth), [pageWidth]);

  if (pageWidth <= 0) {
    return null;
  }

  return (
    <ReanimatedFlatList
      testID={testIds.onboarding.walkthroughPager}
      ref={listRef}
      data={steps}
      renderItem={renderItem}
      keyExtractor={walkthroughStepKeyExtractor}
      horizontal
      pagingEnabled
      bounces={false}
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={SCROLL_EVENT_THROTTLE}
      onScroll={onScroll}
      onMomentumScrollEnd={onMomentumScrollEnd}
      getItemLayout={getItemLayout}
      initialNumToRender={1}
      windowSize={FLAT_LIST_WINDOW_SIZE}
      onScrollToIndexFailed={onScrollToIndexFailed}
    />
  );
};
