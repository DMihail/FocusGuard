/** @format */

import type { AppUsageStat } from '@/specs/types';
import { DEFAULT_APP_LIMITS } from '@/store/constants/appLimits';
import type { DashboardAppRow } from '@/utils/usage/dashboardStats';

import { type ManageAppFixture, mockInstallApps, mockManageApps } from './manageApps';

export const mockUsageByPackage = {
  'com.social.chat': 15 * 60_000,
  'com.game.puzzle': 45 * 60_000,
  'com.news.reader': 5 * 60_000,
} as const satisfies Record<string, number>;

export const mockAppUsageStats: AppUsageStat[] = mockInstallApps.map((app) => ({
  packageName: app.packageName,
  appName: app.appName,
  appImage: app.appImage,
  category: app.category,
  totalTimeForeground: mockUsageByPackage[app.packageName as keyof typeof mockUsageByPackage] ?? 0,
  lastTimeUsed: 0,
}));

/** Selected tracked apps — same package names and labels as ManageApps fixtures. */
export const mockSelectedApps = [mockManageApps[0], mockManageApps[1]];

export const createDashboardAppRow = (
  app: ManageAppFixture,
  usedMs: number,
  limits = DEFAULT_APP_LIMITS,
): DashboardAppRow => {
  const limitMs = limits.hardBlockMinutes * 60_000;
  const rawPercent = limitMs > 0 ? Math.round((usedMs / limitMs) * 100) : 0;

  return {
    ...app,
    usedMs,
    limitMs,
    percentUsed: Math.min(100, rawPercent),
    isOverLimit: limitMs > 0 && usedMs >= limitMs,
  };
};

export const mockDashboardAppRows: DashboardAppRow[] = mockSelectedApps.map((app) =>
  createDashboardAppRow(app, mockUsageByPackage[app.packageName as keyof typeof mockUsageByPackage] ?? 0),
);
