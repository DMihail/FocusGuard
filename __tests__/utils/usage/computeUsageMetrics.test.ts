/** @format */

import { computeUsageMetrics } from '@/utils/usage/computeUsageMetrics';

describe('computeUsageMetrics', () => {
  it('returns zero progress when limit is unset', () => {
    expect(computeUsageMetrics(30 * 60_000, 0)).toEqual({
      barProgress: 0,
      percentUsed: 0,
      isOverLimit: false,
    });
  });

  it('caps percent at 100 while bar can reflect over-limit usage', () => {
    const limitMs = 60 * 60_000;
    const usedMs = 90 * 60_000;

    expect(computeUsageMetrics(usedMs, limitMs)).toEqual({
      barProgress: 100,
      percentUsed: 100,
      isOverLimit: true,
    });
  });

  it('rounds percent used for display', () => {
    const limitMs = 60 * 60_000;
    const usedMs = 20 * 60_000;

    const metrics = computeUsageMetrics(usedMs, limitMs);

    expect(metrics.barProgress).toBeCloseTo(33.33, 1);
    expect(metrics.percentUsed).toBe(33);
    expect(metrics.isOverLimit).toBe(false);
  });
});
