import { useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';

import { getManageAppKey } from '@/domain/appKey';
import type { ManageApp } from '@/domain/types';

import type { RootNavigationProp } from '../types';

export const useNavigateToConfigureLimits = () => {
  const navigation = useNavigation<RootNavigationProp>();

  return useCallback(
    (appOrKey: ManageApp | string) => {
      const appKey = typeof appOrKey === 'string' ? appOrKey : getManageAppKey(appOrKey);
      navigation.navigate('ConfigureLimits', { appKey });
    },
    [navigation],
  );
};
