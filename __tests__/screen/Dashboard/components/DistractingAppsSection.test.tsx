/** @format */

import type React from 'react';

import type { DashboardAppRow } from '@/utils/usage/dashboardStats';

import { cleanupTestTrees, renderTestTree, runTestAct } from '../../../helpers/testRenderer';

import { DistractingAppsSection } from '@/screen/Dashboard/components/DistractingAppsSection';

const mockNavigate = jest.fn();

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

const buildRow = (packageName: string, appName: string): DashboardAppRow => ({
  packageName,
  appName,
  appImage: '',
  category: 'Social',
  categoryLabel: 'Social',
  usedMs: 15 * 60_000,
  limitMs: 60 * 60_000,
  percentUsed: 25,
  isOverLimit: false,
});

describe('DistractingAppsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanupTestTrees();
  });

  it('shows empty text when no apps are selected', () => {
    const tree = renderTestTree(<DistractingAppsSection appRows={[]} onConfigureLimits={mockNavigate} />);
    const emptyText = tree.root.findByProps({ testID: 'dashboard-apps-empty' });

    expect(emptyText.props.children).toBe('No apps selected yet');
  });

  it('renders app rows with usage data', () => {
    const tree = renderTestTree(
      <DistractingAppsSection appRows={[buildRow('com.test.app', 'Test App')]} onConfigureLimits={mockNavigate} />,
    );
    const appRow = tree.root.findByProps({ testID: 'dashboard-app-row-com-test-app' });

    expect(appRow).toBeDefined();
  });

  it('navigates to ConfigureLimits when an app row is pressed', () => {
    const onConfigureLimits = jest.fn();
    const tree = renderTestTree(
      <DistractingAppsSection appRows={[buildRow('com.test.app', 'Test App')]} onConfigureLimits={onConfigureLimits} />,
    );
    const row = tree.root.findByProps({ testID: 'dashboard-app-row-com-test-app' });

    runTestAct(() => {
      row.props.onPress();
    });

    expect(onConfigureLimits).toHaveBeenCalledWith('com.test.app');
  });
});
