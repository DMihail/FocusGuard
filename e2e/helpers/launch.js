/** Detox launch presets — `e2ePreset` is read by native E2EBootstrap (see source/testing/e2eBootstrap.ts). */

const { device } = require('detox');

/** @typedef {'fresh' | 'permissions' | 'dashboard'} E2ELaunchPreset */

const launchApp = async (preset = 'fresh', options = {}) => {
  await device.launchApp({
    newInstance: true,
    launchArgs: { e2ePreset: preset },
    ...options,
  });
};

module.exports = { launchApp };
