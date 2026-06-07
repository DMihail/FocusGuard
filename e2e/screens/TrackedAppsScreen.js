const { trackedApps } = require('../testIds');
const { byId, tapById, waitForVisible } = require('../helpers/wait');

class TrackedAppsScreen {
  get root() {
    return byId(trackedApps.screen);
  }

  async waitForScreen() {
    await waitForVisible(trackedApps.screen);
  }

  async goBack() {
    await tapById(trackedApps.backButton);
  }
}

module.exports = { TrackedAppsScreen };
