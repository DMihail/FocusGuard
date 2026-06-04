/** @format */

import type { LinkingOptions } from '@react-navigation/native';

import type { RootStackParamList } from './types';

/** Custom URL scheme for in-app and notification deep links. */
export const DEEP_LINK_SCHEME = 'focusguard';

export const DEEP_LINK_PREFIX = `${DEEP_LINK_SCHEME}://`;

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [DEEP_LINK_PREFIX],
  config: {
    screens: {
      Onboarding: 'onboarding',
      EnablePermissions: 'permissions',
      Dashboard: 'dashboard',
      ManageApps: 'manage-apps',
      ConfigureLimits: 'configure/:packageName',
      Settings: 'settings',
      LegalDocument: 'legal/:documentId',
    },
  },
};

export const buildDashboardDeepLink = (): string => `${DEEP_LINK_PREFIX}dashboard`;

export const buildConfigureLimitsDeepLink = (packageName: string): string =>
  `${DEEP_LINK_PREFIX}configure/${encodeURIComponent(packageName)}`;
