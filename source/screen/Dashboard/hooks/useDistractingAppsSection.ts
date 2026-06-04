/** @format */

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

  const toggleMonitoring = () => {
    configureSectionLayoutAnimation();
    toggleMonitoringInStore();
  };

  return {
    selectedApps,
    isMonitoring,
    monitoringButtonTitle: isMonitoring ? 'Stop' : 'Start',
    toggleMonitoring,
    openConfigureLimits,
  };
};
