/** @format */

export type UsageMetrics = {
  barProgress: number;
  percentUsed: number;
  isOverLimit: boolean;
};

/** Derives progress bar fill, capped percent label, and over-limit flag from usage vs cap. */
export const computeUsageMetrics = (usedMs: number, limitMs: number): UsageMetrics => {
  const barProgress = limitMs > 0 ? Math.min(100, (usedMs / limitMs) * 100) : 0;
  const percentUsed = limitMs > 0 ? Math.min(100, Math.round((usedMs / limitMs) * 100)) : 0;
  const isOverLimit = limitMs > 0 && usedMs >= limitMs;

  return { barProgress, percentUsed, isOverLimit };
};
