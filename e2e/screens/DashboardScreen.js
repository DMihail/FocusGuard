const { expect } = require('detox');

const { dashboard } = require('../testIds');
const { byId, tapById, waitForVisible } = require('../helpers/wait');

class DashboardScreen {
  get root() {
    return byId(dashboard.screen);
  }

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

  async expectVisible() {
    await expect(this.root).toBeVisible();
  }
}

module.exports = { DashboardScreen };
