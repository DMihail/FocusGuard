/** @format */

import { appLimitsStore } from './appLimitsStore';
import { NATIVE_TRACKING_SNAPSHOT_VERSION } from './persistSchema';
import { selectedAppsStore } from './selectedAppsStore';
import type { AppLimits } from './types';

export type AndroidTrackingSnapshot = {
  version: number;
  trackedApps: string[];
  limitsByPackage: Record<string, AppLimits>;
};

export const buildAndroidTrackingSnapshot = (): AndroidTrackingSnapshot => ({
  version: NATIVE_TRACKING_SNAPSHOT_VERSION,
  trackedApps: selectedAppsStore.getState().apps.map((app) => app.packageName),
  limitsByPackage: appLimitsStore.getState().limitsByPackage,
});
