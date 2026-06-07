const { DashboardScreen } = require('../screens/DashboardScreen');
const { ManageAppsScreen } = require('../screens/ManageAppsScreen');
const { TrackedAppsScreen } = require('../screens/TrackedAppsScreen');
const { SettingsScreen, LegalDocumentScreen } = require('../screens/SettingsScreen');
const { launchApp } = require('../helpers/launch');
const { waitForAppReady } = require('../helpers/wait');

describe('Dashboard navigation', () => {
  beforeEach(async () => {
    await launchApp('dashboard');
    await waitForAppReady();
  });

  it('lands on dashboard with quick actions', async () => {
    const dashboard = new DashboardScreen();
    await dashboard.waitForScreen();
    await dashboard.expectQuickActionsVisible();
  });

  it('opens manage apps and returns to dashboard', async () => {
    const dashboard = new DashboardScreen();
    const manageApps = new ManageAppsScreen();

    await dashboard.waitForScreen();
    await dashboard.openManageApps();
    await manageApps.waitForScreen();
    await manageApps.goBack();
    await dashboard.waitForScreen();
  });

  it('opens tracked apps list and returns', async () => {
    const dashboard = new DashboardScreen();
    const trackedApps = new TrackedAppsScreen();

    await dashboard.waitForScreen();
    await dashboard.openTrackedApps();
    await trackedApps.waitForScreen();
    await trackedApps.goBack();
    await dashboard.waitForScreen();
  });

  it('opens settings, legal documents, and navigates back', async () => {
    const dashboard = new DashboardScreen();
    const settings = new SettingsScreen();
    const legal = new LegalDocumentScreen();

    await dashboard.waitForScreen();
    await dashboard.openSettings();
    await settings.waitForScreen();

    await settings.openDataPrivacy();
    await legal.waitForDataPrivacy();
    await legal.goBackFromDataPrivacy();

    await settings.openTerms();
    await legal.waitForTermsPrivacy();
    await legal.goBackFromTerms();

    await settings.goBack();
    await dashboard.waitForScreen();
  });
});
