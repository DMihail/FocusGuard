/** @format */

import type { ViewStyle } from 'react-native';

import { spacing } from '@/theme';

const TABLET_MIN_WIDTH = 600;

/** Readable content column on phones and tablets (Material / HIG ~560dp). */
const CONTENT_MAX_WIDTH = 560;

const isTabletLayout = (width: number): boolean => width >= TABLET_MIN_WIDTH;

const getContentHorizontalPadding = (width: number): number => {
  if (width >= 840) {
    return spacing.xxxl;
  }

  if (isTabletLayout(width)) {
    return spacing.xxl;
  }

  return spacing.xl;
};

const getContentColumnWidth = (windowWidth: number): number => Math.min(windowWidth, CONTENT_MAX_WIDTH);

/** Width inside horizontal padding — use for charts, chip grids, etc. */
export const getContentInnerWidth = (windowWidth: number): number => {
  const padding = getContentHorizontalPadding(windowWidth);

  return Math.max(0, getContentColumnWidth(windowWidth) - padding * 2);
};

export type ContentLayoutMetrics = {
  innerWidth: number;
  isTablet: boolean;
  contentInsetStyle: ViewStyle;
};

export const getContentLayoutMetrics = (windowWidth: number): ContentLayoutMetrics => {
  const horizontalPadding = getContentHorizontalPadding(windowWidth);
  const columnWidth = getContentColumnWidth(windowWidth);
  const innerWidth = Math.max(0, columnWidth - horizontalPadding * 2);

  return {
    innerWidth,
    isTablet: isTabletLayout(windowWidth),
    contentInsetStyle: {
      width: '100%',
      maxWidth: CONTENT_MAX_WIDTH,
      alignSelf: 'center',
      paddingHorizontal: horizontalPadding,
    },
  };
};
