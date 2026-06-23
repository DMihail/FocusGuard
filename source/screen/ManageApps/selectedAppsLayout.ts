/** @format */

import { lineHeight, spacing } from '@/theme';

import { MAX_SELECTED_CHIP_ROWS, SELECTED_CHIP_HEIGHT, SELECTED_CHIP_WIDTH } from './constants';

const LIST_HORIZONTAL_PADDING = spacing.xl * 2;

const TWO_ROW_CHIP_STRIP_HEIGHT =
  MAX_SELECTED_CHIP_ROWS * SELECTED_CHIP_HEIGHT + (MAX_SELECTED_CHIP_ROWS - 1) * spacing.sm;

export type SelectedAppsLayout = {
  stripWidth: number;
  chipsPerRow: number;
  usesColumnScroll: boolean;
  columnStripHeight: number;
  expandedHeight: number;
};

/** Single layout snapshot for the selected-apps strip (replaces many small helpers). */
export const getSelectedAppsLayout = (windowWidth: number, chipCount: number): SelectedAppsLayout => {
  const stripWidth = Math.max(0, windowWidth - LIST_HORIZONTAL_PADDING);
  const chipsPerRow =
    stripWidth <= 0 ? 1 : Math.max(1, Math.floor((stripWidth + spacing.sm) / (SELECTED_CHIP_WIDTH + spacing.sm)));
  const usesColumnScroll = chipCount > chipsPerRow * MAX_SELECTED_CHIP_ROWS;
  const rowCount = chipCount <= 0 ? 0 : Math.min(MAX_SELECTED_CHIP_ROWS, Math.ceil(chipCount / chipsPerRow));
  const stripHeight =
    chipCount <= 0
      ? 0
      : usesColumnScroll
      ? TWO_ROW_CHIP_STRIP_HEIGHT
      : rowCount * SELECTED_CHIP_HEIGHT + (rowCount - 1) * spacing.sm;

  return {
    stripWidth,
    chipsPerRow,
    usesColumnScroll,
    columnStripHeight: TWO_ROW_CHIP_STRIP_HEIGHT,
    expandedHeight: chipCount > 0 ? lineHeight.md + spacing.md + stripHeight : 0,
  };
};
