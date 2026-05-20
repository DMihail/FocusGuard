/** @format */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { LayoutAnimation } from 'react-native';

const mockCheckForPermission = jest.fn();
const mockCheckForQueryAllPackagesPermission = jest.fn();

jest.mock('../../../source/specs', () => ({
  checkForPermission: (...args: unknown[]) => mockCheckForPermission(...args),
  checkForQueryAllPackagesPermission: (...args: unknown[]) => mockCheckForQueryAllPackagesPermission(...args),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: { children: React.ReactNode }) => <View {...props}>{children}</View>,
  };
});

jest.mock('../../../source/screen/EnablePermissions/hooks/usePermissionCardAnimation', () => ({
  usePermissionCardAnimation: (status: 'granted' | 'pending') => ({
    cardStyle: {},
    iconBoxStyle: {},
    pendingIconOpacity: status === 'pending' ? 1 : 0,
    grantedIconOpacity: status === 'granted' ? 1 : 0,
    badgeStyle: {},
    grantButtonStyle: {},
    isGranted: status === 'granted',
  }),
}));

import { EnablePermissionsScreen } from '../../../source/screen/EnablePermissions/EnablePermissionsScreen';

describe('EnablePermissionsScreen', () => {
  const configureNextSpy = jest.spyOn(LayoutAnimation, 'configureNext').mockImplementation(() => undefined);
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckForPermission.mockReturnValue(true);
    mockCheckForQueryAllPackagesPermission.mockReturnValue(true);
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
  });

  it('renders header, permission cards, privacy notice, and footer', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<EnablePermissionsScreen />);
    });

    expect(tree!.root.findByProps({ children: 'Enable Permissions' })).toBeDefined();
    expect(tree!.root.findByProps({ children: 'Usage Access' })).toBeDefined();
    expect(tree!.root.findByProps({ children: 'Display Over Apps' })).toBeDefined();
    expect(tree!.root.findByProps({ children: 'Notifications' })).toBeDefined();
    expect(
      tree!.root.findByProps({
        children: 'All data stays on your device. We never collect or share your usage information.',
      }),
    ).toBeDefined();
    expect(tree!.root.findByProps({ children: 'Continue' })).toBeDefined();
  });

  it('keeps Continue disabled until all permissions are granted', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<EnablePermissionsScreen />);
    });

    expect(tree!.root.findByProps({ accessibilityLabel: 'Continue' }).props.disabled).toBe(true);
  });

  it('enables Continue after all grant buttons are pressed', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<EnablePermissionsScreen />);
    });

    ReactTestRenderer.act(() => {
      tree!.root.findByProps({ accessibilityLabel: 'Grant Usage Access' }).props.onPress();
      tree!.root.findByProps({ accessibilityLabel: 'Grant Display Over Apps' }).props.onPress();
      tree!.root.findByProps({ accessibilityLabel: 'Grant Notifications' }).props.onPress();
    });

    expect(tree!.root.findByProps({ accessibilityLabel: 'Continue' }).props.disabled).toBe(false);
  });

  it('does not grant usage access when required native permissions are missing', () => {
    mockCheckForPermission.mockReturnValue(false);
    mockCheckForQueryAllPackagesPermission.mockReturnValue(false);

    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<EnablePermissionsScreen />);
    });

    ReactTestRenderer.act(() => {
      tree!.root.findByProps({ accessibilityLabel: 'Grant Usage Access' }).props.onPress();
    });

    expect(configureNextSpy).not.toHaveBeenCalled();
    expect(tree!.root.findByProps({ accessibilityLabel: 'Continue' }).props.disabled).toBe(true);
  });

  it('configures layout animation when a permission is granted', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<EnablePermissionsScreen />);
    });

    ReactTestRenderer.act(() => {
      tree!.root.findByProps({ accessibilityLabel: 'Grant Display Over Apps' }).props.onPress();
    });

    expect(configureNextSpy).toHaveBeenCalled();
  });
});
