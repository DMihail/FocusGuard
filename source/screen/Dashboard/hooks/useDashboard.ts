/** @format */

import { useMemo } from 'react';

import { useShallow } from 'zustand/react/shallow';

import { useTrackedAppRows } from '@/hooks/useTrackedAppRows';
import { useTrackedAppsRefresh } from '@/hooks/useTrackedAppsRefresh';
import { useNavigateToConfigureLimits } from '@/navigation/hooks/useNavigateToConfigureLimits';
import { monitoringStore } from '@/store';
import { buildDashboardSummary } from '@/utils/usage/dashboardStats';

/** Dashboard screen state: tracked rows, summary stats, monitoring toggle, pull-to-refresh. */
export const useDashboard = () => {
  const { appRows, refreshUsage } = useTrackedAppRows();
  const { isMonitoring, toggleMonitoring } = monitoringStore(
    useShallow((state) => ({
      isMonitoring: state.isMonitoring,
      toggleMonitoring: state.toggle,
    })),
  );
  const openConfigureLimits = useNavigateToConfigureLimits();
  const { refreshControl } = useTrackedAppsRefresh(refreshUsage);

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
    refreshControl,
  };
};
