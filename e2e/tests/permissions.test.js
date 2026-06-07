const { EnablePermissionsScreen } = require('../screens/EnablePermissionsScreen');
const { launchApp } = require('../helpers/launch');
const { waitForAppReady } = require('../helpers/wait');

describe('Enable Permissions', () => {
  beforeEach(async () => {
    await launchApp('permissions');
    await waitForAppReady();
  });

  it('shows permission cards after onboarding is skipped', async () => {
    const permissions = new EnablePermissionsScreen();
    await permissions.waitForScreen();
    await permissions.expectCardsVisible();
  });

  it('keeps continue visible when required permissions are pending', async () => {
    const permissions = new EnablePermissionsScreen();
    await permissions.waitForScreen();
    await permissions.expectContinueDisabled();
  });
});
