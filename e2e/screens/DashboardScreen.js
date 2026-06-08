const { dashboard } = require('../testIds');
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
    await tapById(dashboard.viewAllAppsButton);
  }

  async expectQuickActionsVisible() {
    await waitForVisible(dashboard.focusModeButton);
    await waitForVisible(dashboard.manageAppsButton);
  }
}

module.exports = { DashboardScreen };
