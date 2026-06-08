const { dashboard } = require('../testIds');
const { openDeepLink } = require('../helpers/deepLink');
const { tapById, waitForVisible } = require('../helpers/wait');

class DashboardScreen {
  async waitForScreen() {
    await waitForVisible(dashboard.screen);
  }

  async openSettings() {
    await tapById(dashboard.settingsButton);
  }

  async openManageApps() {
    await tapById(dashboard.manageAppsButton);
  }

  async openTrackedApps() {
    // "View All" is only rendered when more than four apps are tracked — deep link is stable.
    await openDeepLink('tracked-apps');
  }

  async expectQuickActionsVisible() {
    await waitForVisible(dashboard.focusModeButton);
    await waitForVisible(dashboard.manageAppsButton);
  }
}

module.exports = { DashboardScreen };
