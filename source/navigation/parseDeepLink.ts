/** @format */

import { DEEP_LINK_PREFIX } from './linking';
import type { RootStackParamList } from './types';

export type ParsedDeepLink =
  | { screen: 'Dashboard' }
  | { screen: 'ConfigureLimits'; params: RootStackParamList['ConfigureLimits'] };

/** Parses `focusguard://` URLs emitted by Android notification intents. */
export const parseDeepLink = (url: string | null | undefined): ParsedDeepLink | null => {
  if (!url?.startsWith(DEEP_LINK_PREFIX)) {
    return null;
  }

  const path = url.slice(DEEP_LINK_PREFIX.length).replace(/^\/+/, '');

  if (path === 'dashboard') {
    return { screen: 'Dashboard' };
  }

  const configureMatch = path.match(/^configure\/(.+)$/);

  if (configureMatch?.[1]) {
    return {
      screen: 'ConfigureLimits',
      params: { packageName: decodeURIComponent(configureMatch[1]) },
    };
  }

  return null;
};
