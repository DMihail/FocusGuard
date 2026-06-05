/** @format */

import type { LinkingOptions } from '@react-navigation/native';

import type { RootStackParamList } from './types';

export const DEEP_LINK_PREFIX = 'focusguard://';

export type DeepLinkTarget =
  | { screen: 'Dashboard' }
  | { screen: 'TrackedApps' }
  | { screen: 'ConfigureLimits'; params: RootStackParamList['ConfigureLimits'] };

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

export const rootLinking: LinkingOptions<RootStackParamList> = {
  prefixes: [DEEP_LINK_PREFIX],
  config: {
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
  },
};
