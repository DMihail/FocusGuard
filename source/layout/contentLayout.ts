/** @format */

import type { ViewStyle } from 'react-native';

import { spacing } from '@/theme';

/** Minimum width treated as tablet / iPad layout. */
export const TABLET_MIN_WIDTH = 600;

/** Readable content column on phones and tablets (Material / HIG ~560dp). */
export const CONTENT_MAX_WIDTH = 560;

export const isTabletLayout = (width: number): boolean => width >= TABLET_MIN_WIDTH;

export const getContentHorizontalPadding = (width: number): number => {
  if (width >= 840) {
    return spacing.xxxl;
  }

  if (isTabletLayout(width)) {
    return spacing.xxl;
  }

  return spacing.xl;
};

export const getContentColumnWidth = (windowWidth: number): number => Math.min(windowWidth, CONTENT_MAX_WIDTH);

/** Width inside horizontal padding — use for charts, chip grids, etc. */
export const getContentInnerWidth = (windowWidth: number): number => {
  const padding = getContentHorizontalPadding(windowWidth);

  return Math.max(0, getContentColumnWidth(windowWidth) - padding * 2);
};

export type ContentLayoutMetrics = {
  windowWidth: number;
  columnWidth: number;
  innerWidth: number;
  horizontalPadding: number;
  isTablet: boolean;
  contentShellStyle: ViewStyle;
  scrollContentStyle: ViewStyle;
  insetStyle: ViewStyle;
};

export const getContentLayoutMetrics = (windowWidth: number): ContentLayoutMetrics => {
  const horizontalPadding = getContentHorizontalPadding(windowWidth);
  const columnWidth = getContentColumnWidth(windowWidth);
  const innerWidth = Math.max(0, columnWidth - horizontalPadding * 2);
  const contentShellStyle: ViewStyle = {
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
  };

  return {
    windowWidth,
    columnWidth,
    innerWidth,
    horizontalPadding,
    isTablet: isTabletLayout(windowWidth),
    contentShellStyle,
    scrollContentStyle: {
      ...contentShellStyle,
      paddingHorizontal: horizontalPadding,
    },
    insetStyle: {
      ...contentShellStyle,
      paddingHorizontal: horizontalPadding,
    },
  };
};
