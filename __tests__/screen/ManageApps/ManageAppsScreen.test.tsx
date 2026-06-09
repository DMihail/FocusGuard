/** @format */

import type React from 'react';
import { act } from 'react-test-renderer';

import type { ManageApp } from '@/domain/types';
import { mockInstallApps, mockManageApps } from '@/testing/fixtures/manageApps';
import { testIds } from '@/testing/testIds';

import {
  cleanupTestTrees,
  flushVirtualizedListTimers,
  flushVirtualizedListWork,
  renderTestTree,
  runTestAct,
  updateTestTree,
} from '../../helpers/testRenderer';

const mockGoBack = jest.fn();
const mockGetInstalledApplications = jest.fn();

const mockStoreState: {
  apps: ManageApp[];
  toggleApp: jest.Mock;
  isSelected: (packageName: string) => boolean;
  syncSelectedAppsMetadata: jest.Mock;
} = {
  apps: [],
  toggleApp: jest.fn((app: ManageApp) => {
    const isSelected = mockStoreState.apps.some((item) => item.packageName === app.packageName);

    mockStoreState.apps = isSelected
      ? mockStoreState.apps.filter((item) => item.packageName !== app.packageName)
      : [...mockStoreState.apps, app];
  }),
  isSelected: (packageName) => mockStoreState.apps.some((app) => app.packageName === packageName),
  syncSelectedAppsMetadata: jest.fn(),
};

jest.mock('@/hooks/useGoBack', () => ({
  useGoBack: () => mockGoBack,
}));

jest.mock('@/navigation/hooks/useNavigateToConfigureLimits', () => ({
  useNavigateToConfigureLimits: () => jest.fn(),
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
  selectedAppsStore: Object.assign((selector: (state: typeof mockStoreState) => unknown) => selector(mockStoreState), {
    getState: () => mockStoreState,
  }),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: { children: React.ReactNode }) => <View {...props}>{children}</View>,
  };
});

import { invalidateInstalledAppsCache } from '@/domain/installedAppsCatalog';
import { SELECTED_APPS_ACCORDION_SETTLE_MS } from '@/screen/ManageApps/constants';
import { ManageAppsScreen } from '@/screen/ManageApps/ManageAppsScreen';

describe('ManageAppsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    invalidateInstalledAppsCache();
    mockStoreState.apps = [];
    mockGetInstalledApplications.mockReturnValue(mockInstallApps);
  });

  const flushInstalledAppsLoad = async (tree: ReturnType<typeof renderTestTree>) => {
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    updateTestTree(tree, <ManageAppsScreen />);
  };

  afterEach(async () => {
    flushVirtualizedListTimers();
    cleanupTestTrees();
    jest.useRealTimers();
    await flushVirtualizedListWork();
  });

  it('renders header, search, filters, and app list', async () => {
    const tree = renderTestTree(<ManageAppsScreen />);
    await flushInstalledAppsLoad(tree);
    flushVirtualizedListTimers();

    expect(tree.root.findByProps({ testID: testIds.manageApps.screen })).toBeDefined();
    expect(tree.root.findByProps({ testID: testIds.manageApps.header })).toBeDefined();
    expect(tree.root.findByProps({ testID: testIds.manageApps.searchInput })).toBeDefined();
    expect(tree.root.findByProps({ testID: testIds.manageApps.categoryFilters })).toBeDefined();
    expect(tree.root.findByProps({ testID: testIds.manageApps.appsList })).toBeDefined();
    expect(tree.root.findByProps({ testID: testIds.manageApps.selectedCount }).props.children).toBe('0 selected');
    expect(tree.root.findByProps({ children: 'Social Chat' })).toBeDefined();
  });

  it('hides selected chips when nothing is selected', async () => {
    const tree = renderTestTree(<ManageAppsScreen />);
    await flushInstalledAppsLoad(tree);
    flushVirtualizedListTimers();

    expect(
      tree.root.findAll(
        (node) => typeof node.props.testID === 'string' && node.props.testID.startsWith('manage-apps-selected-chip-'),
      ),
    ).toHaveLength(0);
  });

  it('shows selected chips after toggling an app', async () => {
    const tree = renderTestTree(<ManageAppsScreen />);
    await flushInstalledAppsLoad(tree);
    flushVirtualizedListTimers();

    runTestAct(() => {
      tree.root.findByProps({ testID: testIds.manageApps.appRow('com.game.puzzle') }).props.onPress();
    });

    updateTestTree(tree, <ManageAppsScreen />);
    flushVirtualizedListTimers();

    expect(tree.root.findByProps({ testID: testIds.manageApps.selectedSection })).toBeDefined();
    expect(tree.root.findByProps({ testID: testIds.manageApps.selectedChip('com.game.puzzle') })).toBeDefined();
    expect(tree.root.findByProps({ testID: testIds.manageApps.selectedCount }).props.children).toBe('1 selected');
  });

  it('removes a selected app when chip remove button is pressed', async () => {
    mockStoreState.apps = [mockManageApps[1]];

    const tree = renderTestTree(<ManageAppsScreen />);
    await flushInstalledAppsLoad(tree);
    flushVirtualizedListTimers();

    expect(tree.root.findByProps({ testID: testIds.manageApps.selectedChip('com.game.puzzle') })).toBeDefined();

    runTestAct(() => {
      tree.root.findByProps({ testID: testIds.manageApps.selectedChipRemove('com.game.puzzle') }).props.onPress();
    });

    updateTestTree(tree, <ManageAppsScreen />);

    expect(tree.root.findByProps({ testID: testIds.manageApps.selectedCount }).props.children).toBe('0 selected');

    runTestAct(() => {
      jest.advanceTimersByTime(SELECTED_APPS_ACCORDION_SETTLE_MS);
    });

    updateTestTree(tree, <ManageAppsScreen />);
    flushVirtualizedListTimers();

    expect(
      tree.root.findAll(
        (node) => typeof node.props.testID === 'string' && node.props.testID.startsWith('manage-apps-selected-chip-'),
      ),
    ).toHaveLength(0);
  });

  it('filters apps when search query changes', async () => {
    const tree = renderTestTree(<ManageAppsScreen />);
    await flushInstalledAppsLoad(tree);
    flushVirtualizedListTimers();

    runTestAct(() => {
      tree.root.findByProps({ testID: testIds.manageApps.searchInput }).props.onChangeText('news');
    });

    runTestAct(() => {
      jest.advanceTimersByTime(300);
    });
    flushVirtualizedListTimers();

    expect(tree.root.findByProps({ children: 'News Reader' })).toBeDefined();
    expect(tree.root.findAllByProps({ children: 'Social Chat' })).toHaveLength(0);
  });

  it('filters apps when category chip is pressed', async () => {
    const tree = renderTestTree(<ManageAppsScreen />);
    await flushInstalledAppsLoad(tree);
    flushVirtualizedListTimers();

    runTestAct(() => {
      tree.root.findByProps({ testID: testIds.manageApps.categoryFilter('Game') }).props.onPress();
    });
    flushVirtualizedListTimers();

    expect(tree.root.findByProps({ children: 'Puzzle Game' })).toBeDefined();
    expect(tree.root.findAllByProps({ children: 'Social Chat' })).toHaveLength(0);
  });

  it('navigates back when back button is pressed', async () => {
    const tree = renderTestTree(<ManageAppsScreen />);
    await flushInstalledAppsLoad(tree);
    flushVirtualizedListTimers();

    runTestAct(() => {
      tree.root.findByProps({ accessibilityLabel: 'Go back' }).props.onPress();
    });

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
