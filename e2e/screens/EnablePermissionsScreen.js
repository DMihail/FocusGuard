const { expect } = require('detox');

const { enablePermissions } = require('../testIds');
const { byId, waitForVisible } = require('../helpers/wait');

class EnablePermissionsScreen {
  async waitForScreen() {
    await waitForVisible(enablePermissions.screen);
  }

  async expectContinueDisabled() {
    await expect(byId(enablePermissions.continueButton)).toBeVisible();
  }

  async expectCardsVisible() {
    await expect(byId(enablePermissions.cards)).toBeVisible();
  }
}

module.exports = { EnablePermissionsScreen };
