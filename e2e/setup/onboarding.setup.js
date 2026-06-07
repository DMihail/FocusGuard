const { launchApp } = require('./helpers/launch');
const { waitForAppReady } = require('./helpers/wait');

beforeEach(async () => {
  await launchApp('fresh');
  await waitForAppReady();
});
