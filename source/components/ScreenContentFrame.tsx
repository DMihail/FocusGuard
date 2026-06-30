/** @format */

import React from 'react';
import { View } from 'react-native';

import type { StyleProp, ViewStyle } from 'react-native';

import { useContentLayout } from '@/hooks/useContentLayout';

type ScreenContentFrameProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Centers screen body within a max-width column with responsive horizontal inset. */
export const ScreenContentFrame = ({ children, style }: ScreenContentFrameProps) => {
  const { contentInsetStyle } = useContentLayout();

  return <View style={[contentInsetStyle, style]}>{children}</View>;
};
