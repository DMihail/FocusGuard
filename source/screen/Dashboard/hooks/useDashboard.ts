/** @format */

import { useCallback, useMemo, useState } from 'react';

import { useTrackedAppRows } from '@/hooks/useTrackedAppRows';
import { useNavigateToConfigureLimits } from '@/navigation/hooks/useNavigateToConfigureLimits';
import { monitoringStore } from '@/store';
import { buildDashboardSummary } from '@/utils/usage/dashboardStats';

export const useDashboard = () => {
  const { appRows, refreshUsage } = useTrackedAppRows();
  const isMonitoring = monitoringStore((state) => state.isMonitoring);
  const toggleMonitoring = monitoringStore((state) => state.toggle);
  const openConfigureLimits = useNavigateToConfigureLimits();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshUsage();
    requestAnimationFrame(() => {
      setRefreshing(false);
    });
  }, [refreshUsage]);

  const summary = useMemo(() => buildDashboardSummary(appRows), [appRows]);

  const hasSelectedApps = appRows.length > 0;

  const monitoringSubtitle = useMemo(() => {
    if (!hasSelectedApps) {
      return 'Select apps first';
    }

    return isMonitoring ? 'Monitoring is on' : 'Start a session';
  }, [hasSelectedApps, isMonitoring]);

  return {
    appRows,
    summary,
    hasSelectedApps,
    isMonitoring,
    toggleMonitoring,
    openConfigureLimits,
    monitoringSubtitle,
    refreshing,
    onRefresh,
  };
};
