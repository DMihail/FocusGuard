/** @format */

import React from 'react';
import { AppState, LayoutAnimation } from 'react-native';

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
  const configureNextSpy = jest.spyOn(LayoutAnimation, 'configureNext').mockImplementation(() => undefined);

  beforeEach(() => {
    jest.clearAllMocks();
    triggerPermissionsChanged = undefined;
    appStateListener = undefined;
    mockGetPermissionStatuses.mockReturnValue(pendingStatuses);

    jest.spyOn(AppState, 'addEventListener').mockImplementation((_, listener) => {
      appStateListener = listener as (state: string) => void;
      return { remove: mockRemoveAppStateListener };
    });
  });

  afterAll(() => {
    configureNextSpy.mockRestore();
  });

  it('initializes statuses from getPermissionStatuses', () => {
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

    expect(mockGetPermissionStatuses).toHaveBeenCalled();
    expect(hook!.permissions.every((item) => item.status === 'pending')).toBe(true);
  });

  it('syncs statuses when AppState becomes active', () => {
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

    expect(hook!.permissions.every((item) => item.status === 'granted')).toBe(true);
    expect(hook!.canContinue).toBe(true);
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

  it('calls requestPermissionById from handleGrant', () => {
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

    ReactTestRenderer.act(() => {
      hook!.handleGrant('notifications');
    });

    expect(mockRequestPermissionById).toHaveBeenCalledWith('notifications');
  });

  it('does not trigger layout animation when statuses change on sync', () => {
    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<PermissionsProbe onReady={() => undefined} />);
    });

    configureNextSpy.mockClear();
    mockGetPermissionStatuses.mockReturnValue(grantedStatuses);

    ReactTestRenderer.act(() => {
      appStateListener?.('active');
    });

    expect(configureNextSpy).not.toHaveBeenCalled();
  });

  it('does not trigger layout animation when statuses stay the same', () => {
    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<PermissionsProbe onReady={() => undefined} />);
    });

    configureNextSpy.mockClear();

    ReactTestRenderer.act(() => {
      appStateListener?.('active');
    });

    expect(configureNextSpy).not.toHaveBeenCalled();
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

  it('removes AppState listener on unmount', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<PermissionsProbe onReady={() => undefined} />);
    });

    ReactTestRenderer.act(() => {
      tree!.unmount();
    });

    expect(mockRemoveAppStateListener).toHaveBeenCalled();
  });
});
