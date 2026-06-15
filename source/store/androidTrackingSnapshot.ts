import { getManageAppKey } from '@/domain/appKey';

import { appLimitsStore, DEFAULT_APP_LIMITS } from './appLimitsStore';
import { NATIVE_TRACKING_SNAPSHOT_VERSION } from './persistSchema';
import { selectedAppsStore } from './selectedAppsStore';
import type { AppLimits } from './types';

export type AndroidTrackingSnapshot = {
  version: number;
  trackedApps: string[];
  limitsByPackage: Record<string, AppLimits>;
};

export const buildAndroidTrackingSnapshot = (): AndroidTrackingSnapshot => {
  const apps = selectedAppsStore.getState().apps;
  const allLimits = appLimitsStore.getState().limitsByPackage;

  return {
    version: NATIVE_TRACKING_SNAPSHOT_VERSION,
    trackedApps: apps.map((app) => app.packageName),
    limitsByPackage: Object.fromEntries(
      apps.map((app) => {
        const appKey = getManageAppKey(app);
        return [appKey, allLimits[appKey] ?? DEFAULT_APP_LIMITS];
      }),
    ),
  };
};
