/** @format */

import type { DashboardAppRow } from '@/utils/usage/dashboardStats';

import { cleanupTestTrees, renderTestTree, runTestAct } from '../../../helpers/testRenderer';

import { DistractingAppsSection } from '@/screen/Dashboard/components/DistractingAppsSection';

const mockConfigureLimits = jest.fn();
const mockViewAll = jest.fn();

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

const renderSection = (appRows: DashboardAppRow[]) =>
  renderTestTree(
    <DistractingAppsSection appRows={appRows} onConfigureLimits={mockConfigureLimits} onViewAllPress={mockViewAll} />,
  );

describe('DistractingAppsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanupTestTrees();
  });

  it('shows empty text when no apps are selected', () => {
    const tree = renderSection([]);
    const emptyText = tree.root.findByProps({ testID: 'dashboard-apps-empty' });

    expect(emptyText.props.children).toBe('No apps selected yet');
  });

  it('renders app rows with usage data', () => {
    const tree = renderSection([buildRow('com.test.app', 'Test App')]);
    const appRow = tree.root.findByProps({ testID: 'dashboard-app-row-com-test-app' });

    expect(appRow).toBeDefined();
  });

  it('renders at most four app rows on the dashboard', () => {
    const appRows = Array.from({ length: 6 }, (_, index) => buildRow(`com.test.app${index}`, `Test App ${index}`));
    const tree = renderSection(appRows);

    expect(tree.root.findByProps({ testID: 'dashboard-app-row-com-test-app0' })).toBeDefined();
    expect(tree.root.findByProps({ testID: 'dashboard-app-row-com-test-app3' })).toBeDefined();
    expect(tree.root.findAllByProps({ testID: 'dashboard-app-row-com-test-app4' })).toHaveLength(0);
    expect(tree.root.findAllByProps({ testID: 'dashboard-app-row-com-test-app5' })).toHaveLength(0);
  });

  it('opens tracked apps when View All is pressed', () => {
    const appRows = Array.from({ length: 5 }, (_, index) => buildRow(`com.test.app${index}`, `Test App ${index}`));
    const tree = renderSection(appRows);
    const viewAllButton = tree.root.findByProps({ testID: 'dashboard-view-all-apps-button' });

    runTestAct(() => {
      viewAllButton.props.onPress();
    });

    expect(mockViewAll).toHaveBeenCalledTimes(1);
  });

  it('hides View All when four or fewer apps are tracked', () => {
    const tree = renderSection([buildRow('com.test.app', 'Test App')]);

    expect(tree.root.findAllByProps({ testID: 'dashboard-view-all-apps-button' })).toHaveLength(0);
  });

  it('navigates to ConfigureLimits when an app row is pressed', () => {
    const tree = renderSection([buildRow('com.test.app', 'Test App')]);
    const row = tree.root.findByProps({ testID: 'dashboard-app-row-com-test-app' });

    runTestAct(() => {
      row.props.onPress();
    });

    expect(mockConfigureLimits).toHaveBeenCalledWith('com.test.app');
  });
});
