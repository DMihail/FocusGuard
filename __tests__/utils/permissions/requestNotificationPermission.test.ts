/** @format */

import { PermissionsAndroid, Platform } from 'react-native';

const mockCheckForNotificationsPermission = jest.fn();

jest.mock('@/specs', () => ({
  checkForNotificationsPermission: () => mockCheckForNotificationsPermission(),
}));

import { requestPostNotificationsPermission } from '@/utils/permissions/requestNotificationPermission.android';

describe('requestPostNotificationsPermission (Android)', () => {
  const originalVersion = Platform.Version;

  beforeEach(() => {
    jest.clearAllMocks();
    Platform.Version = 33;
    mockCheckForNotificationsPermission.mockReturnValue(false);
    jest.spyOn(PermissionsAndroid, 'request').mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);
  });

  afterEach(() => {
    Platform.Version = originalVersion;
    jest.restoreAllMocks();
  });

  it('returns true when permission is already granted', async () => {
    mockCheckForNotificationsPermission.mockReturnValue(true);

    await expect(requestPostNotificationsPermission()).resolves.toBe(true);
    expect(PermissionsAndroid.request).not.toHaveBeenCalled();
  });

  it('requests POST_NOTIFICATIONS on API 33+', async () => {
    await expect(requestPostNotificationsPermission()).resolves.toBe(true);

    expect(PermissionsAndroid.request).toHaveBeenCalledWith(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      expect.objectContaining({
        title: 'Notifications',
      }),
    );
  });

  it('returns false when the user denies the permission dialog', async () => {
    jest.spyOn(PermissionsAndroid, 'request').mockResolvedValue(PermissionsAndroid.RESULTS.DENIED);

    await expect(requestPostNotificationsPermission()).resolves.toBe(false);
  });
});
