/** @format */

import { useCallback, useMemo, useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
import { useNavigateToConfigureLimits } from '@/navigation/hooks/useNavigateToConfigureLimits';
import { getAppsUsageStats } from '@/specs/NativeUsageStats';
import { appLimitsStore, monitoringStore, selectedAppsStore } from '@/store';
import { buildDashboardAppRows, buildDashboardSummary } from '@/utils/usage/dashboardStats';

export const useDashboard = () => {
  const selectedApps = selectedAppsStore((state) => state.apps);
  const limitsByPackage = appLimitsStore((state) => state.limitsByPackage);
  const getLimits = appLimitsStore((state) => state.getLimits);
  const isMonitoring = monitoringStore((state) => state.isMonitoring);
  const toggleMonitoring = monitoringStore((state) => state.toggle);
  const openConfigureLimits = useNavigateToConfigureLimits();

  const [usageByPackage, setUsageByPackage] = useState<Record<string, number>>({});
  const [refreshing, setRefreshing] = useState(false);

  const refreshUsage = useCallback(() => {
    const stats = getAppsUsageStats();
    setUsageByPackage(Object.fromEntries(stats.map((item) => [item.packageName, item.totalTimeForeground])));
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshUsage();
    }, [refreshUsage]),
  );

  useAppStateOnActive(refreshUsage);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshUsage();
    setRefreshing(false);
  }, [refreshUsage]);

  const appRows = useMemo(
    () => buildDashboardAppRows(selectedApps, limitsByPackage, usageByPackage, getLimits),
    [getLimits, limitsByPackage, selectedApps, usageByPackage],
  );

  const summary = useMemo(() => buildDashboardSummary(appRows), [appRows]);

  const hasSelectedApps = appRows.length > 0;
  const monitoringSubtitle = !hasSelectedApps
    ? 'Select apps first'
    : isMonitoring
    ? 'Monitoring is on'
    : 'Start a session';

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
