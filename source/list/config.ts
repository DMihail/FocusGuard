/** @format */

import type { FlatListProps } from 'react-native';

/** Tuned for medium-length app lists (installed apps, permissions). */
export const APP_LIST_FLAT_LIST_PROPS = {
  initialNumToRender: 12,
  maxToRenderPerBatch: 12,
  windowSize: 7,
  removeClippedSubviews: true,
  keyboardShouldPersistTaps: 'handled',
} as const satisfies Partial<FlatListProps<unknown>>;

/** Short horizontal chip rows (categories, selected apps). */
export const CHIP_ROW_FLAT_LIST_PROPS = {
  initialNumToRender: 8,
  maxToRenderPerBatch: 8,
  windowSize: 5,
  removeClippedSubviews: true,
} as const satisfies Partial<FlatListProps<unknown>>;
