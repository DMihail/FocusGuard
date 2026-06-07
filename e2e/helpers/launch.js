/** Detox launch presets — mirror source/testing/e2eBootstrap.ts E2E_LAUNCH_ARGS */

const { device } = require('detox');

const LAUNCH_PRESETS = {
  fresh: {
    e2eResetStorage: 'true',
  },
  onboarding: {
    e2eResetStorage: 'true',
  },
  permissions: {
    e2eResetStorage: 'true',
    e2eSkipOnboarding: 'true',
  },
  dashboard: {
    e2eResetStorage: 'true',
    e2eSkipOnboarding: 'true',
    e2ePermissionsGranted: 'true',
  },
};

const launchApp = async (preset = 'fresh', options = {}) => {
  const launchArgs = LAUNCH_PRESETS[preset] ?? LAUNCH_PRESETS.fresh;

  await device.launchApp({
    newInstance: true,
    launchArgs,
    ...options,
  });
};

const reloadApp = async (preset = 'fresh') => {
  await launchApp(preset, { delete: false });
};

module.exports = {
  LAUNCH_PRESETS,
  launchApp,
  reloadApp,
};
