const { expect } = require('detox');

const { onboarding } = require('../testIds');
const { byId, tapById, waitForVisible } = require('../helpers/wait');

class OnboardingScreen {
  get root() {
    return byId(onboarding.screen);
  }

  async waitForScreen() {
    await waitForVisible(onboarding.screen);
  }

  async tapContinue() {
    await tapById(onboarding.continueButton);
  }

  async tapSkip() {
    await tapById(onboarding.skipButton);
  }

  async completeWalkthrough() {
    await this.waitForScreen();
    await this.tapContinue();
    await this.tapContinue();
    await this.tapContinue();
  }

  async expectVisible() {
    await expect(this.root).toBeVisible();
  }
}

module.exports = { OnboardingScreen };
