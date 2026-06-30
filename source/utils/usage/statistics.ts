/** @format */

import { getManageAppKey } from '@/domain/appKey';
import type { DailyUsageHistoryEntry } from '@/store/types/usageHistoryStore';
import { MS_PER_MINUTE } from '@/utils/usage/constants';
import type { DashboardAppRow, DashboardSummary } from '@/utils/usage/dashboardStats';
import { buildDashboardSummary } from '@/utils/usage/dashboardStats';
import { getLocalDayKey } from '@/utils/usage/localDayKey';

export type StatisticsPeriod = 'week' | 'month';

export type WeekRangeLabelFormatter = (weekDates: readonly Date[]) => string;

export type UsageChartPoint = {
  label: string;
  usageMinutes: number;
  savedMinutes: number;
};

export type FocusTrendPoint = {
  label: string;
  focusScore: number;
};

export type TopAppUsageStat = {
  appKey: string;
  appName: string;
  appImage: string;
  usedMs: number;
};

export type StatisticsSummary = {
  focusScore: number;
  savedMs: number;
  streakDays: number;
};

const WEEK_DAY_COUNT = 7;
const MONTH_DAY_COUNT = 28;
const MONTH_WEEK_COUNT = 4;
const STREAK_LOOKBACK_DAYS = 120;

const formatDayMonth = (date: Date, locale: string): string =>
  new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(date);

/** Compact label for a 7-day bucket, e.g. "16–22 Jun" or "26 May–1 Jun". */
export const formatWeekRangeLabel = (weekDates: readonly Date[], locale: string): string => {
  if (weekDates.length === 0) {
    return '';
  }

  const start = weekDates[0];
  const end = weekDates[weekDates.length - 1];

  if (!start || !end) {
    return '';
  }

  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    const month = new Intl.DateTimeFormat(locale, { month: 'short' }).format(end);

    return `${start.getDate()}–${end.getDate()} ${month}`;
  }

  return `${formatDayMonth(start, locale)}–${formatDayMonth(end, locale)}`;
};

const defaultWeekRangeLabel = (weekDates: readonly Date[]): string => formatWeekRangeLabel(weekDates, 'en-US');

const shiftLocalDate = (anchor: Date, dayOffset: number): Date => {
  const date = new Date(anchor);
  date.setHours(12, 0, 0, 0);
  date.setDate(anchor.getDate() + dayOffset);

  return date;
};

const getRecentLocalDates = (count: number, anchor = new Date()): Date[] => {
  const dates: Date[] = [];

  for (let offset = count - 1; offset >= 0; offset -= 1) {
    dates.push(shiftLocalDate(anchor, -offset));
  }

  return dates;
};

const splitIntoWeekBuckets = (dates: readonly Date[]): Date[][] => {
  const weeks: Date[][] = Array.from({ length: MONTH_WEEK_COUNT }, () => []);

  dates.forEach((date, index) => {
    weeks[Math.floor(index / WEEK_DAY_COUNT)]?.push(date);
  });

  return weeks;
};

const formatWeekdayLabel = (date: Date, locale: string): string =>
  new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);

const resolveEntry = (
  dayKey: string,
  history: Record<string, DailyUsageHistoryEntry>,
  todayKey: string,
  todayEntry: DailyUsageHistoryEntry | null,
): DailyUsageHistoryEntry | null => {
  if (dayKey === todayKey) {
    return todayEntry;
  }

  return history[dayKey] ?? null;
};

const toMinutes = (ms: number): number => Math.round(ms / MS_PER_MINUTE);

const getPeriodDayCount = (period: StatisticsPeriod): number => (period === 'week' ? WEEK_DAY_COUNT : MONTH_DAY_COUNT);

/** Picks history entries needed for charts, summary, and streak without subscribing to the full store map. */
export const pickStatisticsHistory = (
  byDay: Record<string, DailyUsageHistoryEntry>,
  period: StatisticsPeriod,
  anchor = new Date(),
): Record<string, DailyUsageHistoryEntry> => {
  const dayCount = Math.max(getPeriodDayCount(period), STREAK_LOOKBACK_DAYS);
  const picked: Record<string, DailyUsageHistoryEntry> = {};

  for (let offset = 0; offset < dayCount; offset += 1) {
    const dayKey = getLocalDayKey(shiftLocalDate(anchor, -offset));
    const entry = byDay[dayKey];

    if (entry) {
      picked[dayKey] = entry;
    }
  }

  return picked;
};

export const createDailyHistoryEntry = (
  summary: DashboardSummary,
  appRows: readonly DashboardAppRow[],
): DailyUsageHistoryEntry => {
  const usageByAppKey: Record<string, number> = {};

  for (const row of appRows) {
    usageByAppKey[getManageAppKey(row)] = row.usedMs;
  }

  return {
    totalUsedMs: summary.totalUsedMs,
    totalSavedMs: summary.remainingMs,
    focusScore: summary.focusScore,
    usageByAppKey,
  };
};

export const buildTodayHistoryEntry = (appRows: readonly DashboardAppRow[]): DailyUsageHistoryEntry | null => {
  if (appRows.length === 0) {
    return null;
  }

  return createDailyHistoryEntry(buildDashboardSummary(appRows), appRows);
};

export const buildWeekUsageChart = (
  history: Record<string, DailyUsageHistoryEntry>,
  todayEntry: DailyUsageHistoryEntry | null,
  locale: string,
  anchor = new Date(),
): UsageChartPoint[] => {
  const todayKey = getLocalDayKey(anchor);

  return getRecentLocalDates(WEEK_DAY_COUNT, anchor).map((date) => {
    const dayKey = getLocalDayKey(date);
    const entry = resolveEntry(dayKey, history, todayKey, todayEntry);

    return {
      label: formatWeekdayLabel(date, locale),
      usageMinutes: entry ? toMinutes(entry.totalUsedMs) : 0,
      savedMinutes: entry ? toMinutes(entry.totalSavedMs) : 0,
    };
  });
};

const buildMonthUsageBuckets = (
  history: Record<string, DailyUsageHistoryEntry>,
  todayEntry: DailyUsageHistoryEntry | null,
  anchor: Date,
  formatWeekRangeLabelFn: WeekRangeLabelFormatter,
): UsageChartPoint[] => {
  const todayKey = getLocalDayKey(anchor);
  const weeks = splitIntoWeekBuckets(getRecentLocalDates(MONTH_DAY_COUNT, anchor));

  return weeks.map((weekDates) => {
    let usageMs = 0;
    let savedMs = 0;

    for (const date of weekDates) {
      const entry = resolveEntry(getLocalDayKey(date), history, todayKey, todayEntry);

      if (entry) {
        usageMs += entry.totalUsedMs;
        savedMs += entry.totalSavedMs;
      }
    }

    return {
      label: formatWeekRangeLabelFn(weekDates),
      usageMinutes: toMinutes(usageMs),
      savedMinutes: toMinutes(savedMs),
    };
  });
};

export const buildMonthUsageChart = (
  history: Record<string, DailyUsageHistoryEntry>,
  todayEntry: DailyUsageHistoryEntry | null,
  formatWeekRangeLabelFn: WeekRangeLabelFormatter = defaultWeekRangeLabel,
  anchor = new Date(),
): UsageChartPoint[] => buildMonthUsageBuckets(history, todayEntry, anchor, formatWeekRangeLabelFn);

export const buildFocusTrend = (
  history: Record<string, DailyUsageHistoryEntry>,
  todayEntry: DailyUsageHistoryEntry | null,
  period: StatisticsPeriod,
  locale: string,
  formatWeekRangeLabelFn: WeekRangeLabelFormatter = defaultWeekRangeLabel,
  anchor = new Date(),
): FocusTrendPoint[] => {
  const todayKey = getLocalDayKey(anchor);

  if (period === 'week') {
    return getRecentLocalDates(WEEK_DAY_COUNT, anchor).map((date) => {
      const entry = resolveEntry(getLocalDayKey(date), history, todayKey, todayEntry);

      return {
        label: formatWeekdayLabel(date, locale),
        focusScore: entry?.focusScore ?? 0,
      };
    });
  }

  return splitIntoWeekBuckets(getRecentLocalDates(MONTH_DAY_COUNT, anchor)).map((weekDates) => {
    const scores: number[] = [];

    for (const date of weekDates) {
      const entry = resolveEntry(getLocalDayKey(date), history, todayKey, todayEntry);

      if (entry) {
        scores.push(entry.focusScore);
      }
    }

    const focusScore =
      scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;

    return {
      label: formatWeekRangeLabelFn(weekDates),
      focusScore,
    };
  });
};

const isSuccessfulFocusDay = (entry: DailyUsageHistoryEntry | null): boolean => entry !== null && entry.focusScore > 0;

export const computeFocusStreak = (
  history: Record<string, DailyUsageHistoryEntry>,
  todayEntry: DailyUsageHistoryEntry | null,
  anchor = new Date(),
): number => {
  const todayKey = getLocalDayKey(anchor);
  let streak = 0;

  for (let offset = 0; offset < STREAK_LOOKBACK_DAYS; offset += 1) {
    const entry = resolveEntry(getLocalDayKey(shiftLocalDate(anchor, -offset)), history, todayKey, todayEntry);

    if (!isSuccessfulFocusDay(entry)) {
      break;
    }

    streak += 1;
  }

  return streak;
};

export const buildTopAppsForPeriod = (
  history: Record<string, DailyUsageHistoryEntry>,
  todayEntry: DailyUsageHistoryEntry | null,
  appRows: readonly DashboardAppRow[],
  period: StatisticsPeriod,
  limit = 5,
  anchor = new Date(),
): TopAppUsageStat[] => {
  const todayKey = getLocalDayKey(anchor);
  const dayCount = getPeriodDayCount(period);
  const usageTotals = new Map<string, number>();

  for (let offset = 0; offset < dayCount; offset += 1) {
    const entry = resolveEntry(getLocalDayKey(shiftLocalDate(anchor, -offset)), history, todayKey, todayEntry);

    if (!entry) {
      continue;
    }

    for (const [appKey, usedMs] of Object.entries(entry.usageByAppKey)) {
      usageTotals.set(appKey, (usageTotals.get(appKey) ?? 0) + usedMs);
    }
  }

  const appsByKey = new Map(appRows.map((row) => [getManageAppKey(row), row]));

  return [...usageTotals.entries()]
    .map(([appKey, usedMs]) => {
      const app = appsByKey.get(appKey);

      return {
        appKey,
        appName: app?.appName ?? appKey,
        appImage: app?.appImage ?? '',
        usedMs,
      };
    })
    .sort((left, right) => right.usedMs - left.usedMs)
    .slice(0, limit);
};

export const buildStatisticsSummary = (
  history: Record<string, DailyUsageHistoryEntry>,
  todayEntry: DailyUsageHistoryEntry | null,
  period: StatisticsPeriod,
  anchor = new Date(),
): StatisticsSummary => {
  const todayKey = getLocalDayKey(anchor);
  const dayCount = getPeriodDayCount(period);
  let focusTotal = 0;
  let focusCount = 0;
  let savedMs = 0;

  for (let offset = 0; offset < dayCount; offset += 1) {
    const entry = resolveEntry(getLocalDayKey(shiftLocalDate(anchor, -offset)), history, todayKey, todayEntry);

    if (!entry) {
      continue;
    }

    focusTotal += entry.focusScore;
    focusCount += 1;
    savedMs += entry.totalSavedMs;
  }

  const liveFocusScore = todayEntry?.focusScore ?? 0;

  return {
    focusScore: focusCount > 0 ? Math.round(focusTotal / focusCount) : liveFocusScore,
    savedMs,
    streakDays: computeFocusStreak(history, todayEntry, anchor),
  };
};

export const getChartMaxMinutes = (points: UsageChartPoint[]): number => {
  const peak = points.reduce((max, point) => Math.max(max, point.usageMinutes, point.savedMinutes), 0);

  if (peak <= 40) {
    return 40;
  }

  if (peak <= 80) {
    return 80;
  }

  if (peak <= 120) {
    return 120;
  }

  return Math.ceil(peak / 40) * 40;
};
