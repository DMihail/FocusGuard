/** @format */

import type React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import type { ManageApp } from '@/screen/ManageApps/types';
import { mockInstallApps } from '@/testing/fixtures/manageApps';
import { testIds } from '@/testing/testIds';

const mockGoBack = jest.fn();
const mockGetInstalledApplications = jest.fn();

const mockStoreState: {
  apps: ManageApp[];
  toggleApp: jest.Mock;
  isSelected: (packageName: string) => boolean;
} = {
  apps: [],
  toggleApp: jest.fn((app: ManageApp) => {
    const isSelected = mockStoreState.apps.some((item) => item.packageName === app.packageName);

    mockStoreState.apps = isSelected
      ? mockStoreState.apps.filter((item) => item.packageName !== app.packageName)
      : [...mockStoreState.apps, app];
  }),
  isSelected: (packageName) => mockStoreState.apps.some((app) => app.packageName === packageName),
};

jest.mock('../../../source/navigation', () => ({
  useRootNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    useFocusEffect: (callback: () => void | (() => void)) => {
      React.useEffect(() => {
        const cleanup = callback();
        return typeof cleanup === 'function' ? cleanup : undefined;
      }, [callback]);
    },
  };
});

jest.mock('../../../source/specs', () => ({
  getInstalledApplications: () => mockGetInstalledApplications(),
}));

jest.mock('../../../source/store', () => ({
  selectedAppsStore: (selector: (state: typeof mockStoreState) => unknown) => selector(mockStoreState),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: { children: React.ReactNode }) => <View {...props}>{children}</View>,
  };
});

import { ManageAppsScreen } from '@/screen/ManageApps/ManageAppsScreen';

describe('ManageAppsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStoreState.apps = [];
    mockGetInstalledApplications.mockReturnValue(mockInstallApps);
  });

  it('renders header, search, filters, and app list', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<ManageAppsScreen />);
    });

    expect(tree!.root.findByProps({ testID: testIds.manageApps.screen })).toBeDefined();
    expect(tree!.root.findByProps({ testID: testIds.manageApps.header })).toBeDefined();
    expect(tree!.root.findByProps({ testID: testIds.manageApps.searchInput })).toBeDefined();
    expect(tree!.root.findByProps({ testID: testIds.manageApps.categoryFilters })).toBeDefined();
    expect(tree!.root.findByProps({ testID: testIds.manageApps.appsList })).toBeDefined();
    expect(tree!.root.findByProps({ testID: testIds.manageApps.selectedCount }).props.children).toEqual(
      expect.arrayContaining([0, ' selected']),
    );
    expect(tree!.root.findByProps({ children: 'Social Chat' })).toBeDefined();
  });

  it('hides selected chips when nothing is selected', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<ManageAppsScreen />);
    });

    expect(
      tree!.root.findAll(
        (node) => typeof node.props.testID === 'string' && node.props.testID.startsWith('manage-apps-selected-chip-'),
      ),
    ).toHaveLength(0);
  });

  it('shows selected chips after toggling an app', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<ManageAppsScreen />);
    });

    ReactTestRenderer.act(() => {
      tree!.root.findByProps({ testID: testIds.manageApps.appRow('com.game.puzzle') }).props.onPress();
    });

    ReactTestRenderer.act(() => {
      tree!.update(<ManageAppsScreen />);
    });

    expect(tree!.root.findByProps({ testID: testIds.manageApps.selectedSection })).toBeDefined();
    expect(tree!.root.findByProps({ testID: testIds.manageApps.selectedChip('com.game.puzzle') })).toBeDefined();
    expect(tree!.root.findByProps({ testID: testIds.manageApps.selectedCount }).props.children).toEqual(
      expect.arrayContaining([1, ' selected']),
    );
  });

  it('filters apps when search query changes', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<ManageAppsScreen />);
    });

    ReactTestRenderer.act(() => {
      tree!.root.findByProps({ testID: testIds.manageApps.searchInput }).props.onChangeText('news');
    });

    expect(tree!.root.findByProps({ children: 'News Reader' })).toBeDefined();
    expect(tree!.root.findAllByProps({ children: 'Social Chat' })).toHaveLength(0);
    // CategoryFilters stay mounted inside hidden Activity; filtering is disabled via useManageApps.
  });

  it('filters apps when category chip is pressed', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<ManageAppsScreen />);
    });

    ReactTestRenderer.act(() => {
      tree!.root.findByProps({ testID: testIds.manageApps.categoryFilter('Game') }).props.onPress();
    });

    expect(tree!.root.findByProps({ children: 'Puzzle Game' })).toBeDefined();
    expect(tree!.root.findAllByProps({ children: 'Social Chat' })).toHaveLength(0);
  });

  it('navigates back when back button is pressed', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<ManageAppsScreen />);
    });

    ReactTestRenderer.act(() => {
      tree!.root.findByProps({ accessibilityLabel: 'Go back' }).props.onPress();
    });

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
