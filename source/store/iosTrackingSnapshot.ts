/** @format */

import { getManageAppKey } from '@/domain/appKey';

import { appLimitsStore, DEFAULT_APP_LIMITS } from './appLimitsStore';
import { IOS_TRACKING_SNAPSHOT_KEY, IOS_TRACKING_SNAPSHOT_VERSION } from './persistSchema';
import { selectedAppsStore } from './selectedAppsStore';
import type { AppLimits } from './types';

/** Per-app limits keyed by a stable token id generated when the user picks apps on iOS. */
export type IosAppLimits = AppLimits;

/**
 * Flat tracking snapshot for iOS DeviceActivity / ManagedSettings.
 * Synced to the App Group via Turbo Module in later phases.
 */
export type IosTrackingSnapshot = {
  version: typeof IOS_TRACKING_SNAPSHOT_VERSION;
  platform: 'ios';
  authMode: 'individual';
  trackedAppTokenIds: string[];
  limitsByTokenId: Record<string, IosAppLimits>;
};

export const buildIosTrackingSnapshot = (): IosTrackingSnapshot => {
  const apps = selectedAppsStore.getState().apps;
  const limitsByAppKey = appLimitsStore.getState().limitsByAppKey;

  return {
    version: IOS_TRACKING_SNAPSHOT_VERSION,
    platform: 'ios',
    authMode: 'individual',
    trackedAppTokenIds: apps.map((app) => getManageAppKey(app)),
    limitsByTokenId: Object.fromEntries(
      apps.map((app) => {
        const tokenId = getManageAppKey(app);

        return [tokenId, limitsByAppKey[tokenId] ?? DEFAULT_APP_LIMITS];
      }),
    ),
  };
};

export const platformTrackingSnapshotKey = IOS_TRACKING_SNAPSHOT_KEY;
export const buildPlatformTrackingSnapshot = buildIosTrackingSnapshot;
