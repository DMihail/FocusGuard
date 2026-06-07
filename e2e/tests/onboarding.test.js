const { element, by, expect, waitFor } = require('detox');

const { OnboardingScreen } = require('../screens/OnboardingScreen');
const { launchApp } = require('../helpers/launch');
const { waitForAppReady } = require('../helpers/wait');

describe('Onboarding', () => {
  beforeEach(async () => {
    await launchApp('fresh');
    await waitForAppReady();
  });

  it('shows the onboarding screen on first launch', async () => {
    const onboarding = new OnboardingScreen();
    await onboarding.waitForScreen();
    await onboarding.expectVisible();
  });

  it('advances through walkthrough steps', async () => {
    const onboarding = new OnboardingScreen();
    await onboarding.waitForScreen();
    await onboarding.tapContinue();
    await onboarding.tapContinue();
    await expect(element(by.id('onboarding-continue-button'))).toBeVisible();
  });

  it('skips onboarding and lands on enable permissions', async () => {
    const onboarding = new OnboardingScreen();
    await onboarding.waitForScreen();
    await onboarding.tapSkip();

    await waitFor(element(by.id('enable-permissions-screen')))
      .toBeVisible()
      .withTimeout(10000);
  });
});
