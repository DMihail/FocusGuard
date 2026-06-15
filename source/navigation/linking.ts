/** @format */

import type { LinkingOptions, NavigationState, PartialState } from '@react-navigation/native';

import type { RootStackParamList } from './types';

/** Preferred deep-link scheme for new integrations. */
export const DEEP_LINK_PREFIX = 'keept://';

/** Legacy scheme kept for backward compatibility — see docs/MIGRATION_KEEPT.md. */
export const LEGACY_DEEP_LINK_PREFIX = 'focusguard://';

export const DEEP_LINK_PREFIXES = [DEEP_LINK_PREFIX, LEGACY_DEEP_LINK_PREFIX] as const;

export type DeepLinkTarget =
  | { screen: 'Dashboard' }
  | { screen: 'TrackedApps' }
  | { screen: 'ConfigureLimits'; params: RootStackParamList['ConfigureLimits'] };

type RootNavigationState = PartialState<NavigationState<RootStackParamList>>;

/** Parses the path segment of a deep-link URL (without scheme). */
export const matchDeepLinkPath = (path: string | null | undefined): DeepLinkTarget | null => {
  if (!path) {
    return null;
  }

  const normalizedPath = path.replace(/^\/+/, '');

  if (normalizedPath === 'dashboard') {
    return { screen: 'Dashboard' };
  }

  if (normalizedPath === 'tracked-apps') {
    return { screen: 'TrackedApps' };
  }

  const configureMatch = normalizedPath.match(/^configure\/(.+)$/);

  if (configureMatch?.[1]) {
    return {
      screen: 'ConfigureLimits',
      params: { appKey: decodeURIComponent(configureMatch[1]) },
    };
  }

  return null;
};

const stripDeepLinkPrefix = (url: string): string | null => {
  for (const prefix of DEEP_LINK_PREFIXES) {
    if (url.startsWith(prefix)) {
      return url.slice(prefix.length);
    }
  }

  return null;
};

/** Parses a full deep-link URL emitted by native notification intents. */
export const parseDeepLinkUrl = (url: string | null | undefined): DeepLinkTarget | null => {
  if (!url) {
    return null;
  }

  const path = stripDeepLinkPrefix(url);

  if (path === null) {
    return null;
  }

  return matchDeepLinkPath(path);
};

const rootLinkingConfig: LinkingOptions<RootStackParamList>['config'] = {
  screens: {
    Dashboard: 'dashboard',
    TrackedApps: 'tracked-apps',
    ConfigureLimits: {
      path: 'configure/:appKey',
      parse: {
        appKey: (value: string) => decodeURIComponent(value),
      },
      stringify: {
        appKey: (value: string) => encodeURIComponent(value),
      },
    },
  },
};

/** Ensures cold-start deep links can pop back to Dashboard. */
export const buildRootNavigationStateFromPath = (path: string): RootNavigationState | undefined => {
  const target = matchDeepLinkPath(path);

  if (!target) {
    return undefined;
  }

  if (target.screen === 'Dashboard') {
    return {
      routes: [{ name: 'Dashboard' }],
      index: 0,
    };
  }

  if (target.screen === 'ConfigureLimits') {
    return {
      routes: [{ name: 'Dashboard' }, { name: 'ConfigureLimits', params: target.params }],
      index: 1,
    };
  }

  return {
    routes: [{ name: 'Dashboard' }, { name: target.screen }],
    index: 1,
  };
};

export const rootLinking: LinkingOptions<RootStackParamList> = {
  prefixes: [...DEEP_LINK_PREFIXES],
  config: rootLinkingConfig,
  getStateFromPath: buildRootNavigationStateFromPath,
};
