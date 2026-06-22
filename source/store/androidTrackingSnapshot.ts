import { getManageAppKey } from '@/domain/appKey';

import { appLimitsStore, DEFAULT_APP_LIMITS } from './appLimitsStore';
import { NATIVE_TRACKING_SNAPSHOT_KEY, NATIVE_TRACKING_SNAPSHOT_VERSION } from './persistSchema';
import { selectedAppsStore } from './selectedAppsStore';
import type { AppLimits } from './types';

export type AndroidTrackingSnapshot = {
  version: number;
  trackedApps: string[];
  limitsByAppKey: Record<string, AppLimits>;
};

export const buildAndroidTrackingSnapshot = (): AndroidTrackingSnapshot => {
  const apps = selectedAppsStore.getState().apps;
  const allLimits = appLimitsStore.getState().limitsByAppKey;

  return {
    version: NATIVE_TRACKING_SNAPSHOT_VERSION,
    trackedApps: apps.map((app) => getManageAppKey(app)),
    limitsByAppKey: Object.fromEntries(
      apps.map((app) => {
        const appKey = getManageAppKey(app);
        return [appKey, allLimits[appKey] ?? DEFAULT_APP_LIMITS];
      }),
    ),
  };
};

export const platformTrackingSnapshotKey = NATIVE_TRACKING_SNAPSHOT_KEY;
export const buildPlatformTrackingSnapshot = buildAndroidTrackingSnapshot;
