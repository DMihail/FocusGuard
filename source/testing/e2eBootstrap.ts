/** @format */

import { configureE2EBootstrap, getE2ELaunchArg, isE2EEnabled } from '@/specs';

const parseBool = (value: string | null): boolean => value === 'true';

/**
 * Applies Detox launchArgs before React mounts.
 * Called from index.js so MMKV is seeded before Zustand hydration.
 */
export const applyE2EBootstrapFromLaunchArgs = (): void => {
  if (!isE2EEnabled()) {
    return;
  }

  const preset = getE2ELaunchArg('e2ePreset') as E2ELaunchPreset | null;
  if (preset && preset in E2E_LAUNCH_ARGS) {
    applyLaunchFlags(E2E_LAUNCH_ARGS[preset]);
    return;
  }

  applyLaunchFlags({
    e2eResetStorage: getE2ELaunchArg('e2eResetStorage'),
    e2eSkipOnboarding: getE2ELaunchArg('e2eSkipOnboarding'),
    e2ePermissionsGranted: getE2ELaunchArg('e2ePermissionsGranted'),
  });
};

const applyLaunchFlags = (flags: Record<string, string | null | undefined>): void => {
  const resetStorage = parseBool(flags.e2eResetStorage ?? null);
  const skipOnboarding = parseBool(flags.e2eSkipOnboarding ?? null);
  const permissionsGranted = parseBool(flags.e2ePermissionsGranted ?? null);

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
