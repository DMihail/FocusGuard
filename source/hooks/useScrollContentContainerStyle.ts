/** @format */

import { useMemo } from 'react';

import type { StyleProp, ViewStyle } from 'react-native';

import { useContentLayout } from '@/hooks/useContentLayout';

type ScrollContentLayout = {
  scrollContentContainerStyle: StyleProp<ViewStyle>;
  contentInsetStyle: ViewStyle;
};

/** Merges screen scroll/list base styles with responsive column width and padding. */
export const useScrollContentContainerStyle = (baseStyle: StyleProp<ViewStyle>): ScrollContentLayout => {
  const { contentInsetStyle } = useContentLayout();

  const scrollContentContainerStyle = useMemo(() => [baseStyle, contentInsetStyle], [baseStyle, contentInsetStyle]);

  return { scrollContentContainerStyle, contentInsetStyle };
};
