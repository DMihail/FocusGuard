/** @format */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Platform } from 'react-native';

const mockCheckForPermission = jest.fn();
const mockCheckForQueryAllPackagesPermission = jest.fn();
const mockGetAppsUsageStats = jest.fn();
const mockGetInstalledApplications = jest.fn();
const mockRequestUsageStatsPermission = jest.fn();

jest.mock('../source/specs', () => ({
  checkForPermission: (...args: unknown[]) => mockCheckForPermission(...args),
  checkForQueryAllPackagesPermission: (...args: unknown[]) => mockCheckForQueryAllPackagesPermission(...args),
  getAppsUsageStats: (...args: unknown[]) => mockGetAppsUsageStats(...args),
  getInstalledApplications: (...args: unknown[]) => mockGetInstalledApplications(...args),
  requestUsageStatsPermission: (...args: unknown[]) => mockRequestUsageStatsPermission(...args),
}));

jest.mock('../source/navigation', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Navigation: () => <View testID="navigation" />,
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
  };
});

import App from '../source/App';

describe('App', () => {
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
  const originalPlatform = Platform.OS;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckForPermission.mockReturnValue(false);
    mockCheckForQueryAllPackagesPermission.mockReturnValue(false);
    mockGetAppsUsageStats.mockReturnValue([]);
    mockGetInstalledApplications.mockReturnValue([]);
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'ios' });
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
    Object.defineProperty(Platform, 'OS', { configurable: true, value: originalPlatform });
  });

  it('renders navigation inside the safe area provider', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(<App />);
    });

    expect(tree!.root.findByProps({ testID: 'navigation' })).toBeDefined();
  });

  it('logs permission and installed apps info on mount', async () => {
    mockCheckForQueryAllPackagesPermission.mockReturnValue(true);
    mockCheckForPermission.mockReturnValue(false);
    mockGetInstalledApplications.mockReturnValue([{ packageName: 'com.app', appName: 'App', appImage: '' }]);

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(<App />);
    });

    expect(mockCheckForQueryAllPackagesPermission).toHaveBeenCalled();
    expect(mockCheckForPermission).toHaveBeenCalled();
    expect(mockGetInstalledApplications).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(true);
    expect(consoleLogSpy).toHaveBeenCalledWith(false);
  });

  it('logs usage stats only when usage permission is granted', async () => {
    mockCheckForPermission.mockReturnValue(true);
    mockGetAppsUsageStats.mockReturnValue([
      {
        packageName: 'com.focus',
        appName: 'Focus',
        appImage: '',
        totalTimeForeground: 120_000,
        lastTimeUsed: 1,
      },
    ]);

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(<App />);
    });

    expect(mockGetAppsUsageStats).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(['Focus, com.focus, 2.00, 1']);
  });

  it('requests usage stats permission only on Android', async () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(<App />);
    });

    expect(mockRequestUsageStatsPermission).toHaveBeenCalledTimes(1);
  });

  it('does not request usage stats permission on iOS', async () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'ios' });

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(<App />);
    });

    expect(mockRequestUsageStatsPermission).not.toHaveBeenCalled();
  });
});
