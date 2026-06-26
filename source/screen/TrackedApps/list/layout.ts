/** @format */

import { createFixedRowGetItemLayout } from '@/list/createFixedRowGetItemLayout';
import { spacing } from '@/theme';

/** Matches `AppUsageRow`: icon row (40) + item gap (8) + progress bar (6). */
const TRACKED_APP_LIST_ROW_HEIGHT = 40 + spacing.sm + 6;

/** Matches `scrollContent.gap` in TrackedApps styles. */
const TRACKED_APP_LIST_ROW_GAP = spacing.md;

export const getTrackedAppListItemLayout = createFixedRowGetItemLayout(
  TRACKED_APP_LIST_ROW_HEIGHT,
  TRACKED_APP_LIST_ROW_GAP,
);
