/** @format */

import { createFixedRowGetItemLayout } from '@/list/createFixedRowGetItemLayout';
import { fontSize, spacing } from '@/theme';

/** Matches `AppUsageRow`: icon row (40) + item gap (8) + progress bar (6). */
export const TRACKED_APP_LIST_ROW_HEIGHT = 40 + spacing.sm + 6;

/** Matches `scrollContent.gap` in TrackedApps styles. */
export const TRACKED_APP_LIST_ROW_GAP = spacing.md;

/** Usage caption line height reference — row height uses icon, not text stack. */
export const TRACKED_APP_USAGE_LINE_HEIGHT = fontSize.xs + 2;

export const getTrackedAppListItemLayout = createFixedRowGetItemLayout(
  TRACKED_APP_LIST_ROW_HEIGHT,
  TRACKED_APP_LIST_ROW_GAP,
);
