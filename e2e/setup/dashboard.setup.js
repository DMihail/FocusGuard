const { launchApp } = require('./helpers/launch');
const { waitForAppReady } = require('./helpers/wait');

beforeEach(async () => {
  await launchApp('dashboard');
  await waitForAppReady();
});
