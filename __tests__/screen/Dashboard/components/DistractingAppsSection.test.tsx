/** @format */

import { Button } from 'react-native';

import type React from 'react';

import {
  cleanupTestTrees,
  flushVirtualizedListTimers,
  flushVirtualizedListWork,
  renderTestTree,
  runTestAct,
} from '../../../helpers/testRenderer';

import { DistractingAppsSection } from '@/screen/Dashboard/components/DistractingAppsSection';

const mockToggle = jest.fn();
const mockNavigate = jest.fn();
let mockApps: Array<{
  packageName: string;
  appName: string;
  appImage: string;
  category: string;
  categoryLabel: string;
}> = [];
let mockIsMonitoring = false;

jest.mock('@/navigation/hooks/useNavigateToConfigureLimits', () => ({
  useNavigateToConfigureLimits: () => (packageName: string) => {
    mockNavigate('ConfigureLimits', { packageName });
  },
}));

jest.mock('@/store', () => ({
  selectedAppsStore: (selector: (s: { apps: typeof mockApps }) => unknown) => selector({ apps: mockApps }),
  monitoringStore: (selector: (s: { isMonitoring: boolean; toggle: () => void }) => unknown) =>
    selector({ isMonitoring: mockIsMonitoring, toggle: mockToggle }),
}));

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Link: ({ children, ...props }: { children: React.ReactNode; testID?: string }) => (
      <Text {...props}>{children}</Text>
    ),
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

describe('DistractingAppsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockApps = [];
    mockIsMonitoring = false;
  });

  afterEach(async () => {
    flushVirtualizedListTimers();
    cleanupTestTrees();
    jest.useRealTimers();
    await flushVirtualizedListWork();
  });

  it('shows empty text when no apps are selected', () => {
    const tree = renderTestTree(<DistractingAppsSection />);
    flushVirtualizedListTimers();
    const emptyText = tree.root.findByProps({ testID: 'dashboard-apps-empty' });

    expect(emptyText.props.children).toBe('No apps selected yet');
  });

  it('does not show Start/Stop button when no apps are selected', () => {
    const tree = renderTestTree(<DistractingAppsSection />);
    flushVirtualizedListTimers();
    const buttons = tree.root.findAllByType(Button);

    expect(buttons).toHaveLength(0);
  });

  it('renders app rows when apps are selected', () => {
    mockApps = [
      { packageName: 'com.test.app', appName: 'Test App', appImage: '', category: 'Social', categoryLabel: 'Social' },
    ];

    const tree = renderTestTree(<DistractingAppsSection />);
    flushVirtualizedListTimers();
    const appRow = tree.root.findByProps({ testID: 'dashboard-app-row-com-test-app' });

    expect(appRow).toBeDefined();
  });

  it('shows Start button when apps are selected and monitoring is off', () => {
    mockApps = [
      { packageName: 'com.test.app', appName: 'Test App', appImage: '', category: 'Social', categoryLabel: 'Social' },
    ];
    mockIsMonitoring = false;

    const tree = renderTestTree(<DistractingAppsSection />);
    flushVirtualizedListTimers();
    const button = tree.root.findByType(Button);

    expect(button.props.title).toBe('Start');
  });

  it('shows Stop button with red color when monitoring is active', () => {
    mockApps = [
      { packageName: 'com.test.app', appName: 'Test App', appImage: '', category: 'Social', categoryLabel: 'Social' },
    ];
    mockIsMonitoring = true;

    const tree = renderTestTree(<DistractingAppsSection />);
    flushVirtualizedListTimers();
    const button = tree.root.findByType(Button);

    expect(button.props.title).toBe('Stop');
    expect(button.props.color).toBe('#E74C3C');
  });

  it('navigates to ConfigureLimits when an app row is pressed', () => {
    mockApps = [
      { packageName: 'com.test.app', appName: 'Test App', appImage: '', category: 'Social', categoryLabel: 'Social' },
    ];

    const tree = renderTestTree(<DistractingAppsSection />);
    flushVirtualizedListTimers();
    const row = tree.root.findByProps({ testID: 'dashboard-app-row-com-test-app' });

    runTestAct(() => {
      row.props.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('ConfigureLimits', { packageName: 'com.test.app' });
  });

  it('calls toggle when the button is pressed', () => {
    mockApps = [
      { packageName: 'com.test.app', appName: 'Test App', appImage: '', category: 'Social', categoryLabel: 'Social' },
    ];

    const tree = renderTestTree(<DistractingAppsSection />);
    flushVirtualizedListTimers();
    const button = tree.root.findByType(Button);

    runTestAct(() => {
      button.props.onPress();
    });

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
