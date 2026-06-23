/** @format */

import React from 'react';
import { AppState, Platform } from 'react-native';

import ReactTestRenderer from 'react-test-renderer';

import type { PermissionId, PermissionStatus } from '@/domain/permissions';

const mockGetPermissionStatuses = jest.fn<Record<PermissionId, PermissionStatus>, [boolean?]>();
const mockInvalidatePermissionSnapshot = jest.fn();
const mockRequestPermissionById = jest.fn();

jest.mock('@/domain/permissionSnapshot', () => ({
  getPermissionStatuses: (force?: boolean) => mockGetPermissionStatuses(force),
  invalidatePermissionSnapshot: () => mockInvalidatePermissionSnapshot(),
}));

jest.mock('@/domain/permissions', () => {
  const actual = jest.requireActual('@/domain/permissions');
  return {
    ...actual,
    requestPermissionById: (id: PermissionId) => mockRequestPermissionById(id),
    areRequiredPermissionsGranted: (statuses: Record<PermissionId, PermissionStatus>) =>
      (['usage-access', 'display-over-apps', 'battery-optimization'] as PermissionId[]).every(
        (id) => statuses[id] === 'granted',
      ),
  };
});

let triggerPermissionsChanged: (() => void) | undefined;

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: () => void | (() => void)) => {
    const { useEffect } = require('react');
    useEffect(() => callback(), [callback]);
  },
}));

jest.mock('@/specs', () => ({
  subscribePermissionsChanged: (listener: () => void) => {
    triggerPermissionsChanged = listener;
    return { remove: jest.fn() };
  },
}));

import { usePermissionsSync } from '@/screen/EnablePermissions/hooks/usePermissionsSync';

const pendingStatuses: Record<PermissionId, PermissionStatus> = {
  'usage-access': 'pending',
  'display-over-apps': 'pending',
  notifications: 'pending',
  'battery-optimization': 'pending',
};

const grantedStatuses: Record<PermissionId, PermissionStatus> = {
  'usage-access': 'granted',
  'display-over-apps': 'granted',
  notifications: 'granted',
  'battery-optimization': 'granted',
};

let appStateListener: ((state: string) => void) | undefined;
const mockRemoveAppStateListener = jest.fn();

const PermissionsProbe = ({ onReady }: { onReady: (value: ReturnType<typeof usePermissionsSync>) => void }) => {
  const value = usePermissionsSync();
  onReady(value);
  return null;
};

describe('usePermissionsSync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    triggerPermissionsChanged = undefined;
    appStateListener = undefined;
    mockGetPermissionStatuses.mockReturnValue(pendingStatuses);
    jest.replaceProperty(Platform, 'OS', 'android');

    jest.spyOn(AppState, 'addEventListener').mockImplementation((_, listener) => {
      appStateListener = listener as (state: string) => void;
      return { remove: mockRemoveAppStateListener };
    });
  });

  it('does not sync when AppState is not active', () => {
    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<PermissionsProbe onReady={() => undefined} />);
    });

    const callsBefore = mockGetPermissionStatuses.mock.calls.length;

    ReactTestRenderer.act(() => {
      appStateListener?.('background');
    });

    expect(mockGetPermissionStatuses).toHaveBeenCalledTimes(callsBefore);
  });

  it('keeps usage-access card status aligned with Continue when native read flickers', () => {
    let hook: ReturnType<typeof usePermissionsSync> | undefined;

    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <PermissionsProbe
          onReady={(value) => {
            hook = value;
          }}
        />,
      );
    });

    mockGetPermissionStatuses.mockReturnValue(grantedStatuses);

    ReactTestRenderer.act(() => {
      appStateListener?.('active');
    });

    mockGetPermissionStatuses.mockImplementation((force?: boolean) =>
      force ? { ...grantedStatuses, 'usage-access': 'pending' } : grantedStatuses,
    );

    ReactTestRenderer.act(() => {
      appStateListener?.('active');
    });

    expect(hook!.permissions.find((item) => item.id === 'usage-access')?.status).toBe('pending');
    expect(hook!.canContinue).toBe(false);
  });

  it('syncs statuses when native permissions changed event is emitted', () => {
    let hook: ReturnType<typeof usePermissionsSync> | undefined;

    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <PermissionsProbe
          onReady={(value) => {
            hook = value;
          }}
        />,
      );
    });

    mockGetPermissionStatuses.mockReturnValue(grantedStatuses);

    ReactTestRenderer.act(() => {
      triggerPermissionsChanged?.();
    });

    expect(hook!.permissions.every((item) => item.status === 'granted')).toBe(true);
    expect(hook!.canContinue).toBe(true);
  });
});
