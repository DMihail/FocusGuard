const { element, by, waitFor } = require('detox');

const DEFAULT_TIMEOUT = 15000;

const byId = (testID) => element(by.id(testID));

const waitForVisible = async (testID, timeout = DEFAULT_TIMEOUT) => {
  await waitFor(byId(testID)).toBeVisible().withTimeout(timeout);
};

const waitForHidden = async (testID, timeout = DEFAULT_TIMEOUT) => {
  await waitFor(byId(testID)).not.toBeVisible().withTimeout(timeout);
};

const waitForAppReady = async () => {
  try {
    await waitForHidden('app-loader', DEFAULT_TIMEOUT);
  } catch {
    // Splash may disappear before Detox attaches.
  }
};

const tapById = async (testID) => {
  await waitForVisible(testID);
  await byId(testID).tap();
};

const scrollToId = async (listTestID, targetTestID, direction = 'down') => {
  await waitForVisible(listTestID);
  await waitFor(byId(targetTestID)).toBeVisible().whileElement(by.id(listTestID)).scroll(300, direction);
};

module.exports = {
  byId,
  waitForVisible,
  waitForAppReady,
  tapById,
  scrollToId,
};
