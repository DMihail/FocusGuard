/** @format */

import { createDashboardAppRow, mockDashboardAppRows } from '@/testing/fixtures/dashboard';
import { mockManageApps } from '@/testing/fixtures/manageApps';
import { testIds } from '@/testing/testIds';

import { cleanupTestTrees, renderTestTree, runTestAct } from '../../../helpers/testRenderer';

import { DistractingAppsSection } from '@/screen/Dashboard/components/DistractingAppsSection';

const mockConfigureLimits = jest.fn();
const mockViewAll = jest.fn();

const renderSection = (appRows: typeof mockDashboardAppRows) =>
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
    const emptyText = tree.root.findByProps({ testID: testIds.dashboard.appsEmpty });

    expect(emptyText.props.children).toBe('No apps selected yet');
  });

  it('renders at most four app rows on the dashboard', () => {
    const appRows = Array.from({ length: 6 }, (_, index) =>
      createDashboardAppRow(
        {
          ...mockManageApps[0],
          packageName: `com.social.chat${index}`,
          appName: `Social Chat ${index}`,
        },
        15 * 60_000,
      ),
    );
    const tree = renderSection(appRows);

    expect(tree.root.findByProps({ testID: testIds.dashboard.appRow('com.social.chat0') })).toBeDefined();
    expect(tree.root.findByProps({ testID: testIds.dashboard.appRow('com.social.chat3') })).toBeDefined();
    expect(tree.root.findAllByProps({ testID: testIds.dashboard.appRow('com.social.chat4') })).toHaveLength(0);
    expect(tree.root.findAllByProps({ testID: testIds.dashboard.appRow('com.social.chat5') })).toHaveLength(0);
  });

  it('opens tracked apps when View All is pressed', () => {
    const appRows = Array.from({ length: 5 }, (_, index) =>
      createDashboardAppRow(
        {
          ...mockManageApps[0],
          packageName: `com.social.chat${index}`,
          appName: `Social Chat ${index}`,
        },
        15 * 60_000,
      ),
    );
    const tree = renderSection(appRows);
    const viewAllButton = tree.root.findByProps({ testID: testIds.dashboard.viewAllAppsButton });

    runTestAct(() => {
      viewAllButton.props.onPress();
    });

    expect(mockViewAll).toHaveBeenCalledTimes(1);
  });

  it('hides View All when four or fewer apps are tracked', () => {
    const tree = renderSection([mockDashboardAppRows[0]]);

    expect(tree.root.findAllByProps({ testID: testIds.dashboard.viewAllAppsButton })).toHaveLength(0);
  });

  it('navigates to ConfigureLimits when an app row is pressed', () => {
    const tree = renderSection([mockDashboardAppRows[0]]);
    const row = tree.root.findByProps({ testID: testIds.dashboard.appRow('com.social.chat') });

    runTestAct(() => {
      row.props.onPress();
    });

    expect(mockConfigureLimits).toHaveBeenCalledWith('com.social.chat');
  });
});
