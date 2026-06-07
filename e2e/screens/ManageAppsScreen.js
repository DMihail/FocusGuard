const { manageApps } = require('../testIds');
const { byId, tapById, waitForVisible, scrollToId } = require('../helpers/wait');

class ManageAppsScreen {
  get root() {
    return byId(manageApps.screen);
  }

  async waitForScreen() {
    await waitForVisible(manageApps.screen);
  }

  async search(query) {
    await waitForVisible(manageApps.searchInput);
    await byId(manageApps.searchInput).replaceText(query);
  }

  async toggleAppSelection(packageName) {
    const controlId = manageApps.appSelectionControl(packageName);
    try {
      await tapById(controlId);
      return;
    } catch {
      await scrollToId(manageApps.appsList, controlId);
      await tapById(controlId);
    }
  }

  async goBack() {
    await tapById(manageApps.backButton);
  }
}

module.exports = { ManageAppsScreen };
