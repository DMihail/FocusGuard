/** @format */

import { useNavigateToConfigureLimits } from '@/navigation/hooks/useNavigateToConfigureLimits';
import type { ManageApp } from '@/screen/ManageApps/types';
import { monitoringStore, selectedAppsStore } from '@/store';

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
  const toggleMonitoring = monitoringStore((state) => state.toggle);
  const openConfigureLimits = useNavigateToConfigureLimits();

  return {
    selectedApps,
    isMonitoring,
    monitoringButtonTitle: isMonitoring ? 'Stop' : 'Start',
    toggleMonitoring,
    openConfigureLimits,
  };
};
