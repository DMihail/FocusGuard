const { settings, legal } = require('../testIds');
const { byId, tapById, waitForVisible } = require('../helpers/wait');

class SettingsScreen {
  get root() {
    return byId(settings.screen);
  }

  async waitForScreen() {
    await waitForVisible(settings.screen);
  }

  async openDataPrivacy() {
    await tapById(settings.linkRow('dataPrivacy'));
  }

  async openTerms() {
    await tapById(settings.termsButton);
  }

  async goBack() {
    await tapById(settings.backButton);
  }
}

class LegalDocumentScreen {
  async waitForDataPrivacy() {
    await waitForVisible(legal.dataPrivacy.screen);
  }

  async waitForTermsPrivacy() {
    await waitForVisible(legal.termsPrivacy.screen);
  }

  async goBackFromDataPrivacy() {
    await tapById(legal.dataPrivacy.backButton);
  }

  async goBackFromTerms() {
    await tapById(legal.termsPrivacy.backButton);
  }
}

module.exports = { SettingsScreen, LegalDocumentScreen };
