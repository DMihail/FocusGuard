/** @format */

import type { FlatListProps } from 'react-native';

export const APP_LIST_FLAT_LIST_PROPS = {
  initialNumToRender: 12,
  maxToRenderPerBatch: 12,
  windowSize: 7,
  removeClippedSubviews: true,
  keyboardShouldPersistTaps: 'handled',
} as const satisfies Partial<FlatListProps<unknown>>;

export const CHIP_ROW_FLAT_LIST_PROPS = {
  initialNumToRender: 8,
  maxToRenderPerBatch: 8,
  windowSize: 5,
  removeClippedSubviews: true,
} as const satisfies Partial<FlatListProps<unknown>>;

export const SECTION_SCROLL_FLAT_LIST_PROPS = {
  initialNumToRender: 4,
  maxToRenderPerBatch: 4,
  windowSize: 5,
  removeClippedSubviews: false,
  keyboardShouldPersistTaps: 'handled',
} as const satisfies Partial<FlatListProps<unknown>>;
