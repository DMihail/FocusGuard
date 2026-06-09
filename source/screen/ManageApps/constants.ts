/** @format */

export const MANAGE_APPS_SEARCH_DEBOUNCE_MS = 300;

/** Spring config for the selected-apps accordion (Reanimated). */
export const SELECTED_APPS_ACCORDION_SPRING = {
  damping: 30,
  stiffness: 46,
  mass: 1.4,
  overshootClamping: true,
} as const;

/** Upper bound for accordion settle — used by tests and collapse fallback timer. */
export const SELECTED_APPS_ACCORDION_SETTLE_MS = 1200;
