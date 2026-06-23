/** @format */

import { useMemo } from 'react';

import { useShallow } from 'zustand/react/shallow';

import { useTrackedAppRows } from '@/hooks/useTrackedAppRows';
import { useTrackedAppsRefresh } from '@/hooks/useTrackedAppsRefresh';
import { useTranslation } from '@/i18n';
import { useNavigateToConfigureLimits } from '@/navigation/hooks/useNavigateToConfigureLimits';
import { monitoringStore } from '@/store';
import { buildDashboardSummary } from '@/utils/usage/dashboardStats';

/** Dashboard screen state: tracked rows, summary stats, monitoring toggle, pull-to-refresh. */
export const useDashboard = () => {
  const { t } = useTranslation();
  const { appRows, showUsageRefreshIndicator, refreshUsage } = useTrackedAppRows();
  const { isMonitoring, toggleMonitoring } = monitoringStore(
    useShallow((state) => ({
      isMonitoring: state.isMonitoring,
      toggleMonitoring: state.toggle,
    })),
  );
  const openConfigureLimits = useNavigateToConfigureLimits();
  const { refreshControl, refreshing: isPullRefreshing } = useTrackedAppsRefresh(refreshUsage);

  const summary = useMemo(() => buildDashboardSummary(appRows), [appRows]);

  const hasSelectedApps = appRows.length > 0;

  const monitoringSubtitle = useMemo(() => {
    if (!hasSelectedApps) {
      return t('dashboard.focusModeSubtitle.selectApps');
    }

    return isMonitoring ? t('dashboard.focusModeSubtitle.monitoring') : t('dashboard.focusModeSubtitle.start');
  }, [hasSelectedApps, isMonitoring, t]);

  return {
    appRows,
    summary,
    hasSelectedApps,
    isMonitoring,
    toggleMonitoring,
    openConfigureLimits,
    monitoringSubtitle,
    refreshControl,
    showUsageRefreshIndicator,
    isPullRefreshing,
  };
};
