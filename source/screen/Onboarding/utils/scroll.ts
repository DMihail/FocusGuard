/** @format */

import type { RefObject } from 'react';

import type { WalkthroughStepData } from '../data/walkthroughSteps';

export type WalkthroughListRef = RefObject<{
  scrollToOffset: (options: { offset: number; animated?: boolean }) => void;
} | null>;

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
  (listRef: WalkthroughListRef, pageWidth: number) =>
  ({ index }: { index: number }) => {
    listRef.current?.scrollToOffset({
      offset: index * pageWidth,
      animated: true,
    });
  };
