/** @format */

import { useCallback } from 'react';

import { useGoBack } from '@/hooks/useGoBack';

import { useConfigureLimits } from './useConfigureLimits';

export const useConfigureLimitsScreen = (packageName: string) => {
  const goBack = useGoBack();
  const { save, ...limits } = useConfigureLimits(packageName);

  const handleSave = useCallback(() => {
    save();
    goBack();
  }, [goBack, save]);

  return {
    ...limits,
    goBack,
    handleSave,
  };
};
