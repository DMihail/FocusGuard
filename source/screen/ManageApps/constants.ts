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

/** Upper bound for accordion settle — used by tests and collapse fallback timer. */
export const SELECTED_APPS_ACCORDION_SETTLE_MS = 1200;
