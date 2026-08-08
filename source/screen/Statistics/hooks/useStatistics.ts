/** @format */

import { useCallback, useMemo, useState, useTransition } from 'react';

import { useShallow } from 'zustand/react/shallow';

import { usePersistHydrated } from '@/hooks/usePersistHydrated';
import { useTrackedAppRows } from '@/hooks/useTrackedAppRows';
import { useTrackedAppsRefresh } from '@/hooks/useTrackedAppsRefresh';
import { useTranslation } from '@/i18n';
import { usageHistoryStore } from '@/store';
import {
  buildFocusTrend,
  buildMonthUsageChart,
  buildStatisticsSummary,
  buildTodayHistoryEntry,
  buildTopAppsForPeriod,
  buildWeekUsageChart,
  formatWeekRangeLabel,
  getChartMaxMinutes,
  pickStatisticsHistory,
  type StatisticsPeriod,
} from '@/utils/usage/statistics';

/** Statistics screen state: period selection, chart series, and tracked usage refresh. */
export const useStatistics = () => {
  const { i18n } = useTranslation();
  const [period, setPeriodState] = useState<StatisticsPeriod>('week');
  const [, startPeriodTransition] = useTransition();
  const { appRows, refreshUsage, showUsageRefreshIndicator } = useTrackedAppRows({ lifecycle: false });
  const hasHistoryHydrated = usePersistHydrated(usageHistoryStore);
  const history = usageHistoryStore(
    useShallow((state) => (hasHistoryHydrated ? pickStatisticsHistory(state.byDay, period) : {})),
  );
  const { refreshControl, refreshing: isPullRefreshing } = useTrackedAppsRefresh(refreshUsage);

  const setPeriod = useCallback((next: StatisticsPeriod) => {
    startPeriodTransition(() => {
      setPeriodState(next);
    });
  }, []);

  const locale = i18n.language === 'ru' ? 'ru-RU' : 'en-US';
  const formatWeekRangeLabelForPeriod = useCallback(
    (weekDates: readonly Date[]) => formatWeekRangeLabel(weekDates, locale),
    [locale],
  );

  const todayEntry = useMemo(() => buildTodayHistoryEntry(appRows), [appRows]);

  const summary = useMemo(() => buildStatisticsSummary(history, todayEntry, period), [history, period, todayEntry]);

  const usageChart = useMemo(
    () =>
      period === 'week'
        ? buildWeekUsageChart(history, todayEntry, locale)
        : buildMonthUsageChart(history, todayEntry, formatWeekRangeLabelForPeriod),
    [formatWeekRangeLabelForPeriod, history, locale, period, todayEntry],
  );

  const focusTrend = useMemo(
    () => buildFocusTrend(history, todayEntry, period, locale, formatWeekRangeLabelForPeriod),
    [formatWeekRangeLabelForPeriod, history, locale, period, todayEntry],
  );

  const topApps = useMemo(
    () => buildTopAppsForPeriod(history, todayEntry, appRows, period),
    [appRows, history, period, todayEntry],
  );

  const chartMaxMinutes = useMemo(() => getChartMaxMinutes(usageChart), [usageChart]);

  return {
    period,
    setPeriod,
    summary,
    usageChart,
    focusTrend,
    topApps,
    chartMaxMinutes,
    hasSelectedApps: appRows.length > 0,
    isHistoryReady: hasHistoryHydrated,
    showUsageRefreshIndicator,
    isPullRefreshing,
    refreshControl,
  };
};
