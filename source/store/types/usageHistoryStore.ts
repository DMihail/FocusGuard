/** @format */

export type DailyUsageHistoryEntry = {
  totalUsedMs: number;
  totalSavedMs: number;
  focusScore: number;
  usageByAppKey: Record<string, number>;
};

export type UsageHistoryStore = {
  byDay: Record<string, DailyUsageHistoryEntry>;
  recordDay: (dayKey: string, entry: DailyUsageHistoryEntry) => void;
};
