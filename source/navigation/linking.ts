/** @format */

import type { LinkingOptions, NavigationState, PartialState } from '@react-navigation/native';

import type { RootStackParamList } from './types';

export const DEEP_LINK_PREFIX = 'focusguard://';

export type DeepLinkTarget =
  | { screen: 'Dashboard' }
  | { screen: 'TrackedApps' }
  | { screen: 'ConfigureLimits'; params: RootStackParamList['ConfigureLimits'] };

type RootNavigationState = PartialState<NavigationState<RootStackParamList>>;

/** Parses the path segment of a `focusguard://` URL (without scheme). */
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
      params: { packageName: decodeURIComponent(configureMatch[1]) },
    };
  }

  return null;
};

/** Parses a full deep-link URL emitted by Android notification intents. */
export const parseDeepLinkUrl = (url: string | null | undefined): DeepLinkTarget | null => {
  if (!url?.startsWith(DEEP_LINK_PREFIX)) {
    return null;
  }

  return matchDeepLinkPath(url.slice(DEEP_LINK_PREFIX.length));
};

const rootLinkingConfig: LinkingOptions<RootStackParamList>['config'] = {
  screens: {
    Dashboard: 'dashboard',
    TrackedApps: 'tracked-apps',
    ConfigureLimits: {
      path: 'configure/:packageName',
      parse: {
        packageName: (value: string) => decodeURIComponent(value),
      },
      stringify: {
        packageName: (value: string) => encodeURIComponent(value),
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
  prefixes: [DEEP_LINK_PREFIX],
  config: rootLinkingConfig,
  getStateFromPath: buildRootNavigationStateFromPath,
};
