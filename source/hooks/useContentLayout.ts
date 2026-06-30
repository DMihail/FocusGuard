/** @format */

import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import { type ContentLayoutMetrics, getContentLayoutMetrics } from '@/layout/contentLayout';

/** Responsive column width, padding, and shell styles for stack screens. */
export const useContentLayout = (): ContentLayoutMetrics => {
  const { width } = useWindowDimensions();

  return useMemo(() => getContentLayoutMetrics(width), [width]);
};
