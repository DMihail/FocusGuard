/** @format */

export const MANAGE_APPS_SEARCH_DEBOUNCE_MS = 300;

/** Fixed chip width — must match `selectedChip.width` in styles. */
export const SELECTED_CHIP_WIDTH = 148;

/** Fixed chip height — border (2) + vertical padding (16) + 24px remove control. */
export const SELECTED_CHIP_HEIGHT = 42;

export const MAX_SELECTED_CHIP_ROWS = 2;

/** Spring config for the selected-apps accordion (Reanimated). */
export const SELECTED_APPS_ACCORDION_SPRING = {
  damping: 30,
  stiffness: 46,
  mass: 1.4,
  overshootClamping: true,
} as const;

/** Snappier spring when the section opens (including re-open after full collapse). */
export const SELECTED_APPS_ACCORDION_OPEN_SPRING = {
  damping: 26,
  stiffness: 180,
  mass: 0.9,
  overshootClamping: true,
} as const;
