/** @format */

import { useGoBack } from '@/hooks/useGoBack';

import { useConfigureLimits } from './useConfigureLimits';

export const useConfigureLimitsScreen = (packageName: string) => {
  const goBack = useGoBack();
  const { save, ...limits } = useConfigureLimits(packageName);

  const handleSave = () => {
    save();
    goBack();
  };

  return {
    ...limits,
    goBack,
    handleSave,
  };
};
