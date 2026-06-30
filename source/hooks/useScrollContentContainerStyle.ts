/** @format */

import { useMemo } from 'react';

import type { StyleProp, ViewStyle } from 'react-native';

import { useContentLayout } from '@/hooks/useContentLayout';

/** Merges screen scroll/list base styles with responsive column width and padding. */
export const useScrollContentContainerStyle = (baseStyle: StyleProp<ViewStyle>): StyleProp<ViewStyle> => {
  const { scrollContentStyle } = useContentLayout();

  return useMemo(() => [baseStyle, scrollContentStyle], [baseStyle, scrollContentStyle]);
};
