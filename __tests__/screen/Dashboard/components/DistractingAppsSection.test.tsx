/** @format */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

const mockToggle = jest.fn();
let mockApps: Array<{ packageName: string; appName: string; appImage: string; category: string; categoryLabel: string }> = [];
let mockIsMonitoring = false;

jest.mock('@/store', () => ({
  selectedAppsStore: (selector: (s: { apps: typeof mockApps }) => unknown) =>
    selector({ apps: mockApps }),
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
  };
});

import { Button } from 'react-native';
import { DistractingAppsSection } from '@/screen/Dashboard/components/DistractingAppsSection';

const render = async (ui: React.ReactElement) => {
  let tree: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(ui);
  });
  return tree!;
};

describe('DistractingAppsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApps = [];
    mockIsMonitoring = false;
  });

  it('shows empty text when no apps are selected', async () => {
    const tree = await render(<DistractingAppsSection />);
    const emptyText = tree.root.findByProps({ testID: 'dashboard-apps-empty' });

    expect(emptyText.props.children).toBe('No apps selected yet');
  });

  it('does not show Start/Stop button when no apps are selected', async () => {
    const tree = await render(<DistractingAppsSection />);
    const buttons = tree.root.findAllByType(Button);

    expect(buttons).toHaveLength(0);
  });

  it('renders app rows when apps are selected', async () => {
    mockApps = [
      { packageName: 'com.test.app', appName: 'Test App', appImage: '', category: 'Social', categoryLabel: 'Social' },
    ];

    const tree = await render(<DistractingAppsSection />);
    const appRow = tree.root.findByProps({ testID: 'dashboard-app-row-com-test-app' });

    expect(appRow).toBeDefined();
  });

  it('shows Start button when apps are selected and monitoring is off', async () => {
    mockApps = [
      { packageName: 'com.test.app', appName: 'Test App', appImage: '', category: 'Social', categoryLabel: 'Social' },
    ];
    mockIsMonitoring = false;

    const tree = await render(<DistractingAppsSection />);
    const button = tree.root.findByType(Button);

    expect(button.props.title).toBe('Start');
  });

  it('shows Stop button with red color when monitoring is active', async () => {
    mockApps = [
      { packageName: 'com.test.app', appName: 'Test App', appImage: '', category: 'Social', categoryLabel: 'Social' },
    ];
    mockIsMonitoring = true;

    const tree = await render(<DistractingAppsSection />);
    const button = tree.root.findByType(Button);

    expect(button.props.title).toBe('Stop');
    expect(button.props.color).toBe('#e74c3c');
  });

  it('calls toggle when the button is pressed', async () => {
    mockApps = [
      { packageName: 'com.test.app', appName: 'Test App', appImage: '', category: 'Social', categoryLabel: 'Social' },
    ];

    const tree = await render(<DistractingAppsSection />);
    const button = tree.root.findByType(Button);

    await ReactTestRenderer.act(async () => {
      button.props.onPress();
    });

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
