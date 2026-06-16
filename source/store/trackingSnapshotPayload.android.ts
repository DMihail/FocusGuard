/** @format */

import { buildAndroidTrackingSnapshot } from './androidTrackingSnapshot';
import { NATIVE_TRACKING_SNAPSHOT_KEY } from './persistSchema';

export const buildPlatformTrackingSnapshot = buildAndroidTrackingSnapshot;
export const platformTrackingSnapshotKey = NATIVE_TRACKING_SNAPSHOT_KEY;
