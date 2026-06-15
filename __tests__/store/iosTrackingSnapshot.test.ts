/** @format */

import {
  IOS_SCREEN_TIME_AUTH_MODE,
  IOS_TRACKING_SNAPSHOT_KEYS,
  isIosTrackingSnapshot,
} from '@/store/iosTrackingSnapshot';
import {
  IOS_APP_GROUP_ID,
  IOS_FAMILY_ACTIVITY_SELECTION_KEY,
  IOS_TRACKING_SNAPSHOT_KEY,
  IOS_TRACKING_SNAPSHOT_VERSION,
} from '@/store/persistSchema';

const IOS_SWIFT_CONTRACT = {
  appGroupId: 'group.com.keept.shared',
  iosTrackingSnapshotKey: 'ios-tracking-snapshot-v2',
  iosTrackingSnapshotVersion: 2,
  familyActivitySelectionKey: 'ios-family-activity-selection-v1',
  screenTimeAuthMode: 'individual',
} as const;

describe('iosTrackingSnapshot', () => {
  it('keeps the JS contract aligned with KeeptAppGroup.swift', () => {
    expect(IOS_APP_GROUP_ID).toBe(IOS_SWIFT_CONTRACT.appGroupId);
    expect(IOS_TRACKING_SNAPSHOT_KEY).toBe(IOS_SWIFT_CONTRACT.iosTrackingSnapshotKey);
    expect(IOS_TRACKING_SNAPSHOT_VERSION).toBe(IOS_SWIFT_CONTRACT.iosTrackingSnapshotVersion);
    expect(IOS_FAMILY_ACTIVITY_SELECTION_KEY).toBe(IOS_SWIFT_CONTRACT.familyActivitySelectionKey);
    expect(IOS_SCREEN_TIME_AUTH_MODE).toBe(IOS_SWIFT_CONTRACT.screenTimeAuthMode);
    expect(IOS_TRACKING_SNAPSHOT_KEYS.snapshot).toBe(IOS_TRACKING_SNAPSHOT_KEY);
    expect(IOS_TRACKING_SNAPSHOT_KEYS.familyActivitySelection).toBe(IOS_FAMILY_ACTIVITY_SELECTION_KEY);
  });

  it('validates iOS snapshot shape', () => {
    expect(
      isIosTrackingSnapshot({
        version: 2,
        platform: 'ios',
        authMode: 'individual',
        trackedAppTokenIds: ['token-a'],
        limitsByTokenId: {
          'token-a': { warningMinutes: 30, hardBlockMinutes: 45, strictMode: false },
        },
      }),
    ).toBe(true);

    expect(
      isIosTrackingSnapshot({
        version: 1,
        platform: 'ios',
        authMode: 'individual',
        trackedAppTokenIds: [],
        limitsByTokenId: {},
      }),
    ).toBe(false);
  });
});
