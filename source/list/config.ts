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

/** Fixed vertical section stacks (dashboard sections, nested app rows). */
export const SECTION_SCROLL_FLAT_LIST_PROPS = {
  initialNumToRender: 4,
  maxToRenderPerBatch: 4,
  windowSize: 5,
  removeClippedSubviews: false,
  keyboardShouldPersistTaps: 'handled',
} as const satisfies Partial<FlatListProps<unknown>>;

/** Nested non-scrollable lists inside a parent scroller. */
export const NESTED_FLAT_LIST_PROPS = {
  scrollEnabled: false,
  removeClippedSubviews: false,
  keyboardShouldPersistTaps: 'handled',
} as const satisfies Partial<FlatListProps<unknown>>;
