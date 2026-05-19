/** @format */

import type { RefObject } from 'react';
import type { FlatList } from 'react-native';
import type { WalkthroughStepData } from '../data/walkthroughSteps';

export const clampStepIndex = (index: number, lastStepIndex: number): number =>
  Math.max(0, Math.min(index, lastStepIndex));

export const getStepFromOffset = (offsetX: number, pageWidth: number, lastStepIndex: number): number => {
  if (pageWidth <= 0) {
    return 0;
  }

  return clampStepIndex(Math.round(offsetX / pageWidth), lastStepIndex);
};

export const createGetItemLayout =
  (pageWidth: number) => (_: ArrayLike<WalkthroughStepData> | null | undefined, index: number) => ({
    length: pageWidth,
    offset: pageWidth * index,
    index,
  });

export const createScrollToIndexFailedHandler =
  (listRef: RefObject<FlatList<WalkthroughStepData> | null>, pageWidth: number) =>
  ({ index }: { index: number }) => {
    listRef.current?.scrollToOffset({
      offset: index * pageWidth,
      animated: true,
    });
  };
