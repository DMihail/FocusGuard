/** @format */

import { lineHeight, spacing } from '@/theme';

import { MAX_SELECTED_CHIP_ROWS, SELECTED_CHIP_HEIGHT, SELECTED_CHIP_WIDTH } from './constants';

/** List horizontal padding from `scrollContent` (spacing.xl on each side). */
const STRIP_HORIZONTAL_INSET = spacing.xl * 2;

export const getSelectedAppsStripWidth = (windowWidth: number): number =>
  Math.max(0, windowWidth - STRIP_HORIZONTAL_INSET);

export const getSelectedChipsPerRow = (stripWidth: number): number => {
  if (stripWidth <= 0) {
    return 1;
  }

  return Math.max(1, Math.floor((stripWidth + spacing.sm) / (SELECTED_CHIP_WIDTH + spacing.sm)));
};

/** More chips than fit in two rows at the current width — use column flow + horizontal scroll. */
export const needsSelectedAppsHorizontalScroll = (chipCount: number, chipsPerRow: number): boolean =>
  chipCount > chipsPerRow * MAX_SELECTED_CHIP_ROWS;

export const chunkIntoRows = <T>(items: T[], itemsPerRow: number): T[][] => {
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += itemsPerRow) {
    rows.push(items.slice(index, index + itemsPerRow));
  }

  return rows;
};

export const getSelectedAppsColumnStripHeight = (): number =>
  MAX_SELECTED_CHIP_ROWS * SELECTED_CHIP_HEIGHT + (MAX_SELECTED_CHIP_ROWS - 1) * spacing.sm;

export const getSelectedAppsColumnStripWidth = (chipCount: number): number => {
  if (chipCount <= 0) {
    return 0;
  }

  const columnCount = Math.ceil(chipCount / MAX_SELECTED_CHIP_ROWS);

  return columnCount * SELECTED_CHIP_WIDTH + Math.max(0, columnCount - 1) * spacing.sm;
};

export const getSelectedStripRowCount = (chipCount: number, chipsPerRow: number): number => {
  if (chipCount <= 0) {
    return 0;
  }

  return Math.min(MAX_SELECTED_CHIP_ROWS, Math.ceil(chipCount / chipsPerRow));
};

export const getSelectedStripHeight = (chipCount: number, chipsPerRow: number): number => {
  if (needsSelectedAppsHorizontalScroll(chipCount, chipsPerRow)) {
    return getSelectedAppsColumnStripHeight();
  }

  const rows = getSelectedStripRowCount(chipCount, chipsPerRow);

  if (rows <= 0) {
    return 0;
  }

  return rows * SELECTED_CHIP_HEIGHT + (rows - 1) * spacing.sm;
};

export const getSelectedAppsSectionExpandedHeight = (chipCount: number, chipsPerRow: number): number =>
  lineHeight.md + spacing.md + getSelectedStripHeight(chipCount, chipsPerRow);
