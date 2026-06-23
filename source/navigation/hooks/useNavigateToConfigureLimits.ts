import { useCallback } from 'react';

import { getManageAppKey } from '@/domain/appKey';
import type { ManageApp } from '@/domain/types';
import { useRootNavigation } from '@/navigation';

export const useNavigateToConfigureLimits = () => {
  const navigation = useRootNavigation();

  return useCallback(
    (appOrKey: ManageApp | string) => {
      const appKey = typeof appOrKey === 'string' ? appOrKey : getManageAppKey(appOrKey);
      navigation.navigate('ConfigureLimits', { appKey });
    },
    [navigation],
  );
};
