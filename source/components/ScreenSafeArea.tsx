/** @format */

import React from 'react';

import type { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView, type SafeAreaViewProps } from 'react-native-safe-area-context';

const DEFAULT_EDGES: NonNullable<SafeAreaViewProps['edges']> = ['top', 'bottom'];

type ScreenSafeAreaProps = {
  style: StyleProp<ViewStyle>;
  children: React.ReactNode;
  testID?: string;
  accessibilityLabel?: string;
  edges?: SafeAreaViewProps['edges'];
};

/** Standard full-screen safe area wrapper used by stack screens. */
export const ScreenSafeArea = ({
  style,
  children,
  testID,
  accessibilityLabel,
  edges = DEFAULT_EDGES,
}: ScreenSafeAreaProps) => (
  <SafeAreaView style={style} edges={edges} testID={testID} accessibilityLabel={accessibilityLabel}>
    {children}
  </SafeAreaView>
);
