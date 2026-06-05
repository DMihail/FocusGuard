/** @format */

import type { SharedValue } from 'react-native-reanimated';

export type ScrollIndicatorProps = {
  count: number;
  scrollX: SharedValue<number>;
  pageWidth: number;
};
