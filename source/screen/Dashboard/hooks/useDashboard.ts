/** @format */

import { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';

import { getMonitorStartFailureMessage } from '@/domain/monitorStartFailure';
import { usePersistHydrated } from '@/hooks/usePersistHydrated';
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
  const hasMonitoringHydrated = usePersistHydrated(monitoringStore);
  const isMonitoringPersisted = monitoringStore((state) => state.isMonitoring);
  const isMonitoring = hasMonitoringHydrated ? isMonitoringPersisted : false;
  const openConfigureLimits = useNavigateToConfigureLimits();
  const { refreshControl, refreshing: isPullRefreshing } = useTrackedAppsRefresh(refreshUsage);

  const summary = useMemo(() => buildDashboardSummary(appRows), [appRows]);

  const hasSelectedApps = appRows.length > 0;

  const monitoringSubtitle = useMemo(() => {
    if (!hasMonitoringHydrated) {
      return t('dashboard.focusModeSubtitle.start');
    }

    if (!hasSelectedApps) {
      return t('dashboard.focusModeSubtitle.selectApps');
    }

    return isMonitoring ? t('dashboard.focusModeSubtitle.monitoring') : t('dashboard.focusModeSubtitle.start');
  }, [hasMonitoringHydrated, hasSelectedApps, isMonitoring, t]);

  const toggleMonitoring = useCallback(() => {
    if (!hasMonitoringHydrated) {
      return;
    }

    const result = monitoringStore.getState().toggle();

    if (!result.ok) {
      const { title, message } = getMonitorStartFailureMessage(t, result);
      Alert.alert(title, message);
    }
  }, [hasMonitoringHydrated, t]);

  return {
    appRows,
    summary,
    hasSelectedApps,
    isMonitoring,
    isMonitoringReady: hasMonitoringHydrated,
    toggleMonitoring,
    openConfigureLimits,
    monitoringSubtitle,
    refreshControl,
    showUsageRefreshIndicator,
    isPullRefreshing,
  };
};
