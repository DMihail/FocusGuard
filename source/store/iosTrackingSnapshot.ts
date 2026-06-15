/** @format */

import {
  IOS_FAMILY_ACTIVITY_SELECTION_KEY,
  IOS_TRACKING_SNAPSHOT_KEY,
  IOS_TRACKING_SNAPSHOT_VERSION,
} from './persistSchema';
import type { AppLimits } from './types';

/** Keept uses Screen Time self-control — the device owner limits their own apps. */
export const IOS_SCREEN_TIME_AUTH_MODE = 'individual' as const;

export type IosScreenTimeAuthMode = typeof IOS_SCREEN_TIME_AUTH_MODE;

/** Per-app limits keyed by a stable token id generated when the user picks apps on iOS. */
export type IosAppLimits = AppLimits;

/**
 * Flat tracking snapshot for iOS DeviceActivity / ManagedSettings.
 * Synced to the App Group via Turbo Module in later phases.
 */
export type IosTrackingSnapshot = {
  version: typeof IOS_TRACKING_SNAPSHOT_VERSION;
  platform: 'ios';
  authMode: IosScreenTimeAuthMode;
  trackedAppTokenIds: string[];
  limitsByTokenId: Record<string, IosAppLimits>;
};

export const IOS_TRACKING_SNAPSHOT_KEYS = {
  snapshot: IOS_TRACKING_SNAPSHOT_KEY,
  familyActivitySelection: IOS_FAMILY_ACTIVITY_SELECTION_KEY,
} as const;

export const isIosTrackingSnapshot = (value: unknown): value is IosTrackingSnapshot => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const snapshot = value as Partial<IosTrackingSnapshot>;

  return (
    snapshot.version === IOS_TRACKING_SNAPSHOT_VERSION &&
    snapshot.platform === 'ios' &&
    snapshot.authMode === IOS_SCREEN_TIME_AUTH_MODE &&
    Array.isArray(snapshot.trackedAppTokenIds) &&
    typeof snapshot.limitsByTokenId === 'object' &&
    snapshot.limitsByTokenId !== null
  );
};
