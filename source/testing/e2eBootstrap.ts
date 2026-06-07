/** @format */

import { configureE2EBootstrap, getE2ELaunchArg } from '@/specs';

const parseBool = (value: string | null): boolean => value === 'true';

/**
 * Applies Detox launchArgs before React mounts.
 * Called from index.js so MMKV is seeded before Zustand hydration.
 */
export const applyE2EBootstrapFromLaunchArgs = (): void => {
  if (!__DEV__) {
    return;
  }

  const resetStorage = parseBool(getE2ELaunchArg('e2eResetStorage'));
  const skipOnboarding = parseBool(getE2ELaunchArg('e2eSkipOnboarding'));
  const permissionsGranted = parseBool(getE2ELaunchArg('e2ePermissionsGranted'));

  if (!resetStorage && !skipOnboarding && !permissionsGranted) {
    return;
  }

  configureE2EBootstrap(skipOnboarding, permissionsGranted, resetStorage);
};

export type E2ELaunchPreset = 'fresh' | 'onboarding' | 'permissions' | 'dashboard';

export const E2E_LAUNCH_ARGS: Record<E2ELaunchPreset, Record<string, string>> = {
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
