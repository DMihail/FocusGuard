/** @format */

import type React from 'react';

import { TrackedAppsScreen } from '@/screen/TrackedApps/TrackedAppsScreen';

import { cleanupTestTrees, flushVirtualizedListTimers, renderTestTree } from '../../helpers/testRenderer';

const mockAppRows = [
  {
    packageName: 'com.test.one',
    appName: 'One',
    appImage: '',
    category: 'Social',
    categoryLabel: 'Social',
    usedMs: 1_000,
    limitMs: 60_000,
    percentUsed: 2,
    isOverLimit: false,
  },
];

jest.mock('@/hooks/useGoBack', () => ({
  useGoBack: () => jest.fn(),
}));

jest.mock('@/navigation/hooks/useNavigateToConfigureLimits', () => ({
  useNavigateToConfigureLimits: () => jest.fn(),
}));

jest.mock('@/hooks/useTrackedAppRows', () => ({
  useTrackedAppRows: () => ({
    appRows: mockAppRows,
    refreshUsage: jest.fn(),
  }),
}));

jest.mock('@/hooks/usePullToRefresh', () => ({
  usePullToRefresh: () => ({
    refreshing: false,
    onRefresh: jest.fn(),
  }),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: { children: React.ReactNode }) => <View {...props}>{children}</View>,
  };
});

describe('TrackedAppsScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    flushVirtualizedListTimers();
    cleanupTestTrees();
    jest.useRealTimers();
  });

  it('renders tracked app rows in a FlatList', () => {
    const tree = renderTestTree(<TrackedAppsScreen />);
    flushVirtualizedListTimers();

    expect(tree.root.findByProps({ testID: 'tracked-apps-screen' })).toBeDefined();
    expect(tree.root.findByProps({ testID: 'tracked-apps-scroll' })).toBeDefined();
    expect(tree.root.findByProps({ testID: 'dashboard-app-row-com-test-one' })).toBeDefined();
  });
});
