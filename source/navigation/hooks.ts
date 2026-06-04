/** @format */

import { useNavigation } from '@react-navigation/native';

import type { RootNavigationProp } from './types';

export const useRootNavigation = (): RootNavigationProp => useNavigation<RootNavigationProp>();

export { useAppPermissionGuard } from './hooks/useAppPermissionGuard';
export { useNavigateToConfigureLimits } from './hooks/useNavigateToConfigureLimits';
