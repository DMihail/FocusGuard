/** @format */

import type { ManageApp } from '@/screen/ManageApps/types';
import type { AppLimits } from '@/store';

const MS_PER_MINUTE = 60_000;

export type DashboardAppRow = ManageApp & {
  usedMs: number;
  limitMs: number;
  percentUsed: number;
  isOverLimit: boolean;
};

export type DashboardSummary = {
  focusScore: number;
  totalAllowedMs: number;
  totalUsedMs: number;
  remainingMs: number;
};

export const buildDashboardAppRows = (
  apps: ManageApp[],
  limitsByPackage: Record<string, AppLimits>,
  usageByPackage: Record<string, number>,
  getLimits: (packageName: string) => AppLimits,
): DashboardAppRow[] =>
  apps
    .map((app) => {
      const limits = limitsByPackage[app.packageName] ?? getLimits(app.packageName);
      const usedMs = usageByPackage[app.packageName] ?? 0;
      const limitMs = limits.hardBlockMinutes * MS_PER_MINUTE;
      const percentUsed = limitMs > 0 ? Math.min(100, Math.round((usedMs / limitMs) * 100)) : 0;
      const isOverLimit = limitMs > 0 && usedMs >= limitMs;

      return {
        ...app,
        usedMs,
        limitMs,
        percentUsed: isOverLimit ? Math.round((usedMs / limitMs) * 100) : percentUsed,
        isOverLimit,
      };
    })
    .sort((left, right) => right.usedMs - left.usedMs);

export const buildDashboardSummary = (rows: DashboardAppRow[]): DashboardSummary => {
  const totalAllowedMs = rows.reduce((sum, row) => sum + row.limitMs, 0);
  const totalUsedMs = rows.reduce((sum, row) => sum + Math.min(row.usedMs, row.limitMs), 0);
  const remainingMs = rows.reduce((sum, row) => sum + Math.max(0, row.limitMs - row.usedMs), 0);
  const focusScore =
    totalAllowedMs > 0 ? Math.round(Math.max(0, Math.min(100, (remainingMs / totalAllowedMs) * 100))) : 100;

  return {
    focusScore,
    totalAllowedMs,
    totalUsedMs,
    remainingMs,
  };
};
