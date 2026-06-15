/** @format */

import React, { useEffect, useRef } from 'react';

import ReactTestRenderer, { act } from 'react-test-renderer';

jest.mock('@/screen/Settings/notificationGrant', () =>
  jest.requireActual('@/screen/Settings/notificationGrant.android'),
);

jest.mock('@/utils/permissions/requestNotificationPermission', () =>
  jest.requireActual('@/utils/permissions/requestNotificationPermission.android'),
);

const mockCheckForNotificationsPermission = jest.fn(() => false);
const mockOpenNotificationsSettings = jest.fn();
const mockRequestPostNotificationsPermission = jest.fn(async () => true);
const mockSyncFromSystem = jest.fn();

const mockStoreState = {
  notificationsEnabled: true,
  setNotificationsEnabled: jest.fn((value: boolean) => {
    mockStoreState.notificationsEnabled = value;
  }),
};

jest.mock('@/specs', () => ({
  checkForNotificationsPermission: () => mockCheckForNotificationsPermission(),
  openNotificationsSettings: () => mockOpenNotificationsSettings(),
  subscribePermissionsChanged: () => ({ remove: jest.fn() }),
}));

jest.mock('@/utils/permissions/requestNotificationPermission', () => ({
  requestPostNotificationsPermission: () => mockRequestPostNotificationsPermission(),
}));

jest.mock('@/store', () => ({
  settingsStore: (selector: (state: typeof mockStoreState) => unknown) => selector(mockStoreState),
}));

jest.mock('@/hooks/useAppStateOnActive', () => ({
  useAppStateOnActive: (callback: () => void) => {
    mockSyncFromSystem.mockImplementation(callback);
  },
}));

jest.mock('@react-navigation/native', () => {
  const { useEffect: mockUseEffect } = require('react');

  return {
    useFocusEffect: (callback: () => void) => {
      mockUseEffect(() => {
        callback();
      }, [callback]);
    },
  };
});

import { useNotificationsSetting } from '@/screen/Settings/hooks/useNotificationsSetting';

type HarnessProps = {
  onReady: (value: ReturnType<typeof useNotificationsSetting>) => void;
};

const UseNotificationsSettingHarness = ({ onReady }: HarnessProps) => {
  const value = useNotificationsSetting();
  const onReadyRef = useRef(onReady);

  onReadyRef.current = onReady;

  useEffect(() => {
    onReadyRef.current(value);
  });

  return null;
};

describe('useNotificationsSetting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStoreState.notificationsEnabled = true;
    mockCheckForNotificationsPermission.mockReturnValue(false);
    mockRequestPostNotificationsPermission.mockResolvedValue(true);
  });

  it('reflects granted system permission in isEnabled', () => {
    mockCheckForNotificationsPermission.mockReturnValue(true);
    let result!: ReturnType<typeof useNotificationsSetting>;

    act(() => {
      ReactTestRenderer.create(<UseNotificationsSettingHarness onReady={(value) => (result = value)} />);
    });

    expect(result.isEnabled).toBe(true);
  });

  it('updates isEnabled after the permission dialog grants access', async () => {
    let result!: ReturnType<typeof useNotificationsSetting>;

    act(() => {
      ReactTestRenderer.create(<UseNotificationsSettingHarness onReady={(value) => (result = value)} />);
    });

    expect(result.isEnabled).toBe(false);

    await act(async () => {
      await result.setEnabled(true);
    });

    expect(mockRequestPostNotificationsPermission).toHaveBeenCalled();
    expect(result.isEnabled).toBe(true);
    expect(mockStoreState.notificationsEnabled).toBe(true);
  });

  it('keeps store enabled while the permission dialog is open', async () => {
    let resolveRequest!: (granted: boolean) => void;

    mockRequestPostNotificationsPermission.mockImplementation(
      () =>
        new Promise<boolean>((resolve) => {
          resolveRequest = resolve;
        }),
    );

    let result!: ReturnType<typeof useNotificationsSetting>;

    act(() => {
      ReactTestRenderer.create(<UseNotificationsSettingHarness onReady={(value) => (result = value)} />);
    });

    let pendingRequest!: Promise<void>;

    act(() => {
      pendingRequest = result.setEnabled(true);
    });

    expect(mockStoreState.notificationsEnabled).toBe(true);

    await act(async () => {
      mockCheckForNotificationsPermission.mockReturnValue(true);
      resolveRequest(true);
      await pendingRequest;
    });

    expect(result.isEnabled).toBe(true);
  });

  it('keeps the toggle off when permission is denied', async () => {
    mockRequestPostNotificationsPermission.mockResolvedValue(false);
    let result!: ReturnType<typeof useNotificationsSetting>;

    act(() => {
      ReactTestRenderer.create(<UseNotificationsSettingHarness onReady={(value) => (result = value)} />);
    });

    await act(async () => {
      await result.setEnabled(true);
    });

    expect(result.isEnabled).toBe(false);
    expect(mockStoreState.notificationsEnabled).toBe(false);
  });
});
