/** @format */

import { createFixedRowGetItemLayout } from '@/list/createFixedRowGetItemLayout';
import { spacing } from '@/theme';

/** Matches `appItem` in styles: card border (2) + vertical padding (32) + icon (48). */
export const MANAGE_APP_LIST_ROW_HEIGHT = spacing.lg * 2 + 48 + 2;

/** Matches `scrollContent.gap` in ManageApps styles. */
export const MANAGE_APP_LIST_ROW_GAP = spacing.md;

export const getManageAppListItemLayout = createFixedRowGetItemLayout(
  MANAGE_APP_LIST_ROW_HEIGHT,
  MANAGE_APP_LIST_ROW_GAP,
);
