/** @format */

import { buildDashboardAppRows, buildDashboardSummary } from '@/utils/usage/dashboardStats';
import {
  buildFocusTrend,
  buildMonthUsageChart,
  buildStatisticsSummary,
  buildTodayHistoryEntry,
  buildTopAppsForPeriod,
  buildWeekUsageChart,
  computeFocusStreak,
  createDailyHistoryEntry,
  formatWeekRangeLabel,
  getChartMaxMinutes,
  pickStatisticsHistory,
} from '@/utils/usage/statistics';

const sampleApp = {
  packageName: 'com.example.app',
  appName: 'Example',
  appImage: '',
  category: 'social',
  categoryLabel: 'Social',
};

const anchor = new Date(2026, 5, 22, 15, 0, 0, 0);

describe('statistics utils', () => {
  const appRows = buildDashboardAppRows(
    [sampleApp],
    { 'com.example.app': { hardBlockMinutes: 60, warningMinutes: 45, strictMode: false } },
    { 'com.example.app': 30 * 60_000 },
  );
  const todayEntry = createDailyHistoryEntry(buildDashboardSummary(appRows), appRows);

  const history = {
    '2026-6-20': {
      totalUsedMs: 20 * 60_000,
      totalSavedMs: 40 * 60_000,
      focusScore: 67,
      usageByAppKey: { 'com.example.app': 20 * 60_000 },
    },
    '2026-6-21': {
      totalUsedMs: 15 * 60_000,
      totalSavedMs: 45 * 60_000,
      focusScore: 75,
      usageByAppKey: { 'com.example.app': 15 * 60_000 },
    },
    '2026-6-22': {
      totalUsedMs: 10 * 60_000,
      totalSavedMs: 50 * 60_000,
      focusScore: 83,
      usageByAppKey: { 'com.example.app': 10 * 60_000 },
    },
  };

  it('builds today entry only when apps are selected', () => {
    expect(buildTodayHistoryEntry(appRows)).toEqual(todayEntry);
    expect(buildTodayHistoryEntry([])).toBeNull();
  });

  it('ignores persisted today history when no apps are selected', () => {
    const staleHistory = {
      ...history,
      '2026-6-22': {
        totalUsedMs: 99 * 60_000,
        totalSavedMs: 1 * 60_000,
        focusScore: 1,
        usageByAppKey: { 'com.example.app': 99 * 60_000 },
      },
    };

    const points = buildWeekUsageChart(staleHistory, null, 'en-US', anchor);

    expect(points.at(-1)).toMatchObject({ usageMinutes: 0, savedMinutes: 0 });
    expect(buildStatisticsSummary(staleHistory, null, 'week', anchor).savedMs).toBe((45 + 40) * 60_000);
  });

  it('builds week usage chart with seven points', () => {
    const points = buildWeekUsageChart(history, todayEntry, 'en-US', anchor);

    expect(points).toHaveLength(7);
    expect(points.at(-1)).toMatchObject({ usageMinutes: 30, savedMinutes: 30 });
  });

  it('builds month usage chart with four weekly buckets', () => {
    const points = buildMonthUsageChart(
      history,
      todayEntry,
      (weekDates) => formatWeekRangeLabel(weekDates, 'en-US'),
      anchor,
    );

    expect(points).toHaveLength(4);
    expect(points[0]?.label).toMatch(/–/);
    expect(points.at(-1)?.label).toContain('22');
    expect(points.at(-1)?.usageMinutes).toBeGreaterThan(0);
  });

  it('formats week range labels for month buckets', () => {
    const weekDates = [new Date(2026, 5, 16, 12), new Date(2026, 5, 22, 12)];

    expect(formatWeekRangeLabel(weekDates, 'en-US')).toBe('16–22 Jun');
  });

  it('aggregates top apps from tracked usage history', () => {
    const topApps = buildTopAppsForPeriod(history, todayEntry, appRows, 'week', 5, anchor);

    expect(topApps[0]?.appKey).toBe('com.example.app');
    expect(topApps[0]?.usedMs).toBe(65 * 60_000);
  });

  it('computes focus streak from consecutive days with data', () => {
    expect(computeFocusStreak(history, todayEntry, anchor)).toBe(3);
    expect(computeFocusStreak({}, todayEntry, anchor)).toBe(1);
  });

  it('derives chart max minutes in sensible steps', () => {
    expect(getChartMaxMinutes([{ label: 'Mon', usageMinutes: 0, savedMinutes: 0 }])).toBe(40);
    expect(getChartMaxMinutes([{ label: 'Mon', usageMinutes: 41, savedMinutes: 0 }])).toBe(80);
    expect(getChartMaxMinutes([{ label: 'Mon', usageMinutes: 121, savedMinutes: 0 }])).toBe(160);
  });

  it('builds focus trend for week and month', () => {
    expect(buildFocusTrend(history, todayEntry, 'week', 'en-US', undefined, anchor)).toHaveLength(7);
    expect(buildFocusTrend(history, todayEntry, 'month', 'en-US', undefined, anchor)).toHaveLength(4);
  });

  it('builds period summary with saved time and streak', () => {
    const summary = buildStatisticsSummary(history, todayEntry, 'week', anchor);

    expect(summary.focusScore).toBe(64);
    expect(summary.savedMs).toBe((30 + 45 + 40) * 60_000);
    expect(summary.streakDays).toBe(3);
  });

  it('picks only history entries needed for the active period and streak', () => {
    const extraHistory = {
      ...history,
      '2020-1-1': {
        totalUsedMs: 1,
        totalSavedMs: 1,
        focusScore: 1,
        usageByAppKey: { 'com.example.app': 1 },
      },
    };

    const picked = pickStatisticsHistory(extraHistory, 'week', anchor);

    expect(picked['2020-1-1']).toBeUndefined();
    expect(picked['2026-6-22']).toEqual(extraHistory['2026-6-22']);
  });

  it('sums remaining budget per app in dashboard summary', () => {
    const secondApp = { ...sampleApp, packageName: 'com.other.app', appName: 'Other' };
    const rows = buildDashboardAppRows(
      [sampleApp, secondApp],
      {},
      {
        'com.example.app': 50 * 60_000,
        'com.other.app': 10 * 60_000,
      },
    );
    const summary = buildDashboardSummary(rows);

    expect(summary.remainingMs).toBe(60 * 60_000);
    expect(summary.totalUsedMs).toBe(60 * 60_000);
  });
});
