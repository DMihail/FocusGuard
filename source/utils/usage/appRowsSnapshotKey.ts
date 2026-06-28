/** @format */

import { getManageAppKey } from '@/domain/appKey';
import type { DashboardAppRow } from '@/utils/usage/dashboardStats';

/** Stable fingerprint of tracked app usage for deduplicating history writes. */
export const buildAppRowsSnapshotKey = (appRows: readonly DashboardAppRow[]): string => {
  if (appRows.length === 0) {
    return '';
  }

  return appRows
    .map((row) => `${getManageAppKey(row)}:${row.usedMs}`)
    .sort()
    .join('|');
};
