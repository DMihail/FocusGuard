/** @format */

import { useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';

import type { RootNavigationProp } from '../types';

export const useNavigateToConfigureLimits = (): ((packageName: string) => void) => {
  const navigation = useNavigation<RootNavigationProp>();

  return useCallback(
    (packageName: string) => {
      navigation.navigate('ConfigureLimits', { packageName });
    },
    [navigation],
  );
};
