/** @format */

import React, { useCallback, type RefObject } from 'react';
import {
  Animated,
  FlatList,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { FLAT_LIST_WINDOW_SIZE, SCROLL_EVENT_THROTTLE } from '../constants';
import type { WalkthroughStepData } from '../data/walkthroughSteps';
import { WalkthroughPage } from './WalkthroughPage';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<WalkthroughStepData>);

type WalkthroughPagerProps = {
  listRef: RefObject<FlatList<WalkthroughStepData> | null>;
  steps: WalkthroughStepData[];
  pageWidth: number;
  onScroll: ReturnType<typeof Animated.event>;
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
  const renderItem: ListRenderItem<WalkthroughStepData> = useCallback(
    ({ item }) => <WalkthroughPage item={item} width={pageWidth} />,
    [pageWidth],
  );

  const keyExtractor = useCallback((item: WalkthroughStepData) => item.id, []);

  if (pageWidth <= 0) {
    return null;
  }

  return (
    <AnimatedFlatList
      ref={listRef}
      data={steps}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
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
