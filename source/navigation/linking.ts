/** @format */

import type { LinkingOptions } from '@react-navigation/native';

import type { RootStackParamList } from './types';

export const DEEP_LINK_PREFIX = 'focusguard://';

export const rootLinking: LinkingOptions<RootStackParamList> = {
  prefixes: [DEEP_LINK_PREFIX],
  config: {
    screens: {
      Dashboard: 'dashboard',
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
