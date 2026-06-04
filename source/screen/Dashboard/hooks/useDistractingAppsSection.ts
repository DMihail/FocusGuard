/** @format */

import { useCallback, useMemo } from 'react';

import { useNavigateToConfigureLimits } from '@/navigation/hooks/useNavigateToConfigureLimits';
import type { ManageApp } from '@/screen/ManageApps/types';
import { monitoringStore, selectedAppsStore } from '@/store';
import { configureSectionLayoutAnimation } from '@/utils/layoutAnimation';

export type UseDistractingAppsSectionResult = {
  selectedApps: ManageApp[];
  isMonitoring: boolean;
  monitoringButtonTitle: string;
  toggleMonitoring: () => void;
  openConfigureLimits: (packageName: string) => void;
};

export const useDistractingAppsSection = (): UseDistractingAppsSectionResult => {
  const selectedApps = selectedAppsStore((state) => state.apps);
  const isMonitoring = monitoringStore((state) => state.isMonitoring);
  const toggleMonitoringInStore = monitoringStore((state) => state.toggle);
  const openConfigureLimits = useNavigateToConfigureLimits();

  const toggleMonitoring = useCallback(() => {
    configureSectionLayoutAnimation();
    toggleMonitoringInStore();
  }, [toggleMonitoringInStore]);

  const monitoringButtonTitle = useMemo(() => (isMonitoring ? 'Stop' : 'Start'), [isMonitoring]);

  return {
    selectedApps,
    isMonitoring,
    monitoringButtonTitle,
    toggleMonitoring,
    openConfigureLimits,
  };
};
