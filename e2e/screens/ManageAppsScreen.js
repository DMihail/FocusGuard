const { manageApps } = require('../testIds');
const { tapById, waitForVisible } = require('../helpers/wait');

class ManageAppsScreen {
  async waitForScreen() {
    await waitForVisible(manageApps.screen);
  }

  async goBack() {
    await tapById(manageApps.backButton);
  }
}

module.exports = { ManageAppsScreen };
