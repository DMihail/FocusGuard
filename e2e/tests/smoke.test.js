const { element, by, expect, waitFor } = require('detox');

const { onboarding, enablePermissions, dashboard } = require('../testIds');
const { launchApp } = require('../helpers/launch');
const { waitForAppReady } = require('../helpers/wait');

const ROOT_SCREEN_IDS = [onboarding.screen, enablePermissions.screen, dashboard.screen];

const waitForAnyRootScreen = async (timeoutMs = 15000) => {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    for (const testID of ROOT_SCREEN_IDS) {
      try {
        await expect(element(by.id(testID))).toBeVisible();
        return testID;
      } catch {
        // try next screen
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`None of the root screens became visible: ${ROOT_SCREEN_IDS.join(', ')}`);
};

describe('Smoke', () => {
  it('hydrates and shows a root screen', async () => {
    await launchApp('fresh');
    await waitForAppReady();
    await waitForAnyRootScreen();
  });

  it('bootstraps directly to dashboard in E2E preset', async () => {
    await launchApp('dashboard');
    await waitForAppReady();
    await waitFor(element(by.id(dashboard.screen)))
      .toBeVisible()
      .withTimeout(15000);
    await expect(element(by.id(dashboard.manageAppsButton))).toBeVisible();
  });
});
