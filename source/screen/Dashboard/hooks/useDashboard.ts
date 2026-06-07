/** @format */

import { useMemo } from 'react';

import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { useTrackedAppRows } from '@/hooks/useTrackedAppRows';
import { useNavigateToConfigureLimits } from '@/navigation/hooks/useNavigateToConfigureLimits';
import { monitoringStore } from '@/store';
import { buildDashboardSummary } from '@/utils/usage/dashboardStats';

/** Dashboard screen state: tracked rows, summary stats, monitoring toggle, pull-to-refresh. */
export const useDashboard = () => {
  const { appRows, refreshUsage } = useTrackedAppRows();
  const isMonitoring = monitoringStore((state) => state.isMonitoring);
  const toggleMonitoring = monitoringStore((state) => state.toggle);
  const openConfigureLimits = useNavigateToConfigureLimits();
  const { refreshing, onRefresh } = usePullToRefresh(() => refreshUsage(true));

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
