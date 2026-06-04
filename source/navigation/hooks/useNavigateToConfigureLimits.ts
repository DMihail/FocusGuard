/** @format */

import { useNavigation } from '@react-navigation/native';

import type { RootNavigationProp } from '../types';

export const useNavigateToConfigureLimits = (): ((packageName: string) => void) => {
  const navigation = useNavigation<RootNavigationProp>();

  return (packageName: string) => {
    navigation.navigate('ConfigureLimits', { packageName });
  };
};
