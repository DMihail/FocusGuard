const { expect } = require('detox');

const { enablePermissions } = require('../testIds');
const { byId, tapById, waitForVisible } = require('../helpers/wait');

class EnablePermissionsScreen {
  get root() {
    return byId(enablePermissions.screen);
  }

  async waitForScreen() {
    await waitForVisible(enablePermissions.screen);
  }

  async tapContinue() {
    await tapById(enablePermissions.continueButton);
  }

  async expectContinueDisabled() {
    await expect(byId(enablePermissions.continueButton)).toBeVisible();
  }

  async expectCardsVisible() {
    await expect(byId(enablePermissions.cards)).toBeVisible();
  }
}

module.exports = { EnablePermissionsScreen };
