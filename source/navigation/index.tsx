/** @format */

import { RootNavigationGate } from './RootNavigationGate';

export const Navigation = RootNavigationGate;

export { useRootNavigation } from './hooks';
export {
  buildConfigureLimitsDeepLink,
  buildDashboardDeepLink,
  DEEP_LINK_PREFIX,
  DEEP_LINK_SCHEME,
  linking,
} from './linking';
export type { RootNavigationProp, RootStackParamList } from './types';
