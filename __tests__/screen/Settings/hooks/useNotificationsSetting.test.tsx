/** @format */

import React, { useEffect, useRef } from 'react';

import ReactTestRenderer, { act } from 'react-test-renderer';

jest.mock('@/screen/Settings/notificationGrant', () =>
  jest.requireActual('@/screen/Settings/notificationGrant.android'),
);

const mockCheckForNotificationsPermission = jest.fn(() => false);
const mockOpenNotificationsSettings = jest.fn();
const mockRequestPostNotificationsPermission = jest.fn(async () => true);
let triggerPermissionsChanged: (() => void) | undefined;

const mockStoreState = {
  notificationsEnabled: true,
  themePreference: 'system' as const,
  languagePreference: 'system' as const,
  setNotificationsEnabled: jest.fn((value: boolean) => {
    mockStoreState.notificationsEnabled = value;
  }),
  setThemePreference: jest.fn(),
};

jest.mock('@/specs/keeptTurboModuleApi.android', () => ({
  checkForNotificationsPermission: () => mockCheckForNotificationsPermission(),
  openNotificationsSettings: () => mockOpenNotificationsSettings(),
  subscribePermissionsChanged: (listener: () => void) => {
    triggerPermissionsChanged = listener;
    return { remove: jest.fn() };
  },
}));

jest.mock('@/utils/permissions/requestNotificationPermission', () => ({
  requestPostNotificationsPermission: () => mockRequestPostNotificationsPermission(),
}));

jest.mock('@/store', () => ({
  settingsStore: (selector: (state: typeof mockStoreState) => unknown) => selector(mockStoreState),
}));

jest.mock('@/hooks/useNativePermissionsChangedRefresh', () => ({
  useNativePermissionsChangedRefresh: (refresh: () => void) => {
    const react = require('react');
    react.useEffect(() => {
      triggerPermissionsChanged = refresh;
      return () => {
        triggerPermissionsChanged = undefined;
      };
    }, [refresh]);
  },
}));

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
    triggerPermissionsChanged = undefined;
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

  it('turns the toggle off when native permission is revoked', () => {
    mockCheckForNotificationsPermission.mockReturnValue(true);
    let result!: ReturnType<typeof useNotificationsSetting>;

    act(() => {
      ReactTestRenderer.create(<UseNotificationsSettingHarness onReady={(value) => (result = value)} />);
    });

    expect(result.isEnabled).toBe(true);

    mockCheckForNotificationsPermission.mockReturnValue(false);

    act(() => {
      triggerPermissionsChanged?.();
    });

    expect(result.isEnabled).toBe(false);
    expect(mockStoreState.notificationsEnabled).toBe(false);
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
    expect(result.isEnabled).toBe(true);

    await act(async () => {
      mockCheckForNotificationsPermission.mockReturnValue(true);
      resolveRequest(true);
      await pendingRequest;
    });

    expect(result.isEnabled).toBe(true);
  });

  it('keeps the toggle on while waiting for system grant on Android', async () => {
    let resolveRequest!: (granted: boolean) => void;

    mockRequestPostNotificationsPermission.mockImplementation(
      () =>
        new Promise<boolean>((resolve) => {
          resolveRequest = resolve;
        }),
    );
    mockCheckForNotificationsPermission.mockReturnValue(false);

    let result!: ReturnType<typeof useNotificationsSetting>;

    act(() => {
      ReactTestRenderer.create(<UseNotificationsSettingHarness onReady={(value) => (result = value)} />);
    });

    expect(result.isEnabled).toBe(false);

    let pendingRequest!: Promise<void>;

    act(() => {
      pendingRequest = result.setEnabled(true);
    });

    // Store is on but systemGrant is still false — UI must stay on during the prompt.
    expect(mockStoreState.notificationsEnabled).toBe(true);
    expect(result.isEnabled).toBe(true);

    await act(async () => {
      resolveRequest(false);
      await pendingRequest;
    });

    expect(result.isEnabled).toBe(false);
    expect(mockStoreState.notificationsEnabled).toBe(false);
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
