/** @format */

import { buildIosTrackingSnapshot } from './iosTrackingSnapshot';
import { IOS_TRACKING_SNAPSHOT_KEY } from './persistSchema';

export const buildPlatformTrackingSnapshot = buildIosTrackingSnapshot;
export const platformTrackingSnapshotKey = IOS_TRACKING_SNAPSHOT_KEY;
