/** @format */

import type { FlatListProps } from 'react-native';

type GetItemLayout = NonNullable<FlatListProps<unknown>['getItemLayout']>;

/** Fixed-height row offset calculator for FlatList scroll jumps. */
export const createFixedRowGetItemLayout =
  (rowHeight: number, gap = 0): GetItemLayout =>
  (_data, index) => {
    const stride = rowHeight + gap;

    return {
      length: stride,
      offset: stride * index,
      index,
    };
  };
