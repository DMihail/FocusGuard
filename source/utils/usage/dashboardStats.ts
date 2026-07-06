/** @format */

import { getManageAppKey } from '@/domain/appKey';
import type { ManageApp } from '@/domain/types';
import { type AppLimits, DEFAULT_APP_LIMITS } from '@/store';

import { computeUsageMetrics } from './computeUsageMetrics';
import { MS_PER_MINUTE } from './constants';

export type DashboardAppRow = ManageApp & {
  usedMs: number;
  limitMs: number;
  percentUsed: number;
  barProgress: number;
  isOverLimit: boolean;
};

export type DashboardSummary = {
  focusScore: number;
  totalUsedMs: number;
  totalAllowedMs: number;
  remainingMs: number;
};

/** Builds dashboard rows with usage percentages sorted by time spent. */
export const buildDashboardAppRows = (
  apps: ManageApp[],
  limitsByAppKey: Record<string, AppLimits>,
  usageByPackage: Record<string, number>,
): DashboardAppRow[] =>
  apps
    .map((app) => {
      const appKey = getManageAppKey(app);
      const limits = limitsByAppKey[appKey] ?? DEFAULT_APP_LIMITS;
      const usedMs = usageByPackage[appKey] ?? 0;
      const limitMs = limits.hardBlockMinutes * MS_PER_MINUTE;
      const { barProgress, percentUsed, isOverLimit } = computeUsageMetrics(usedMs, limitMs);

      return {
        ...app,
        usedMs,
        limitMs,
        percentUsed,
        barProgress,
        isOverLimit,
      };
    })
    .sort((left, right) => right.usedMs - left.usedMs);

/** Aggregates focus score and daily totals from dashboard rows. */
export const buildDashboardSummary = (rows: readonly DashboardAppRow[]): DashboardSummary => {
  let totalAllowedMs = 0;
  let totalUsedMs = 0;
  let remainingMs = 0;

  for (const row of rows) {
    totalAllowedMs += row.limitMs;
    totalUsedMs += Math.min(row.usedMs, row.limitMs);
    remainingMs += Math.max(0, row.limitMs - row.usedMs);
  }

  const focusScore =
    totalAllowedMs > 0 ? Math.round(Math.max(0, Math.min(100, (remainingMs / totalAllowedMs) * 100))) : 100;

  return {
    focusScore,
    totalAllowedMs,
    totalUsedMs,
    remainingMs,
  };
};
