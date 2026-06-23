/** @format */

import { formatUsageMinutes, formatUsagePair } from '@/utils/usage/formatUsage';

describe('formatUsage', () => {
  describe('formatUsageMinutes', () => {
    it.each([
      [45 * 60_000, '45m'],
      [2 * 60 * 60_000, '2h'],
      [(2 * 60 + 15) * 60_000, '2h 15m'],
      [-1000, '0m'],
    ] as const)('formats %i ms as %s', (durationMs, expected) => {
      expect(formatUsageMinutes(durationMs)).toBe(expected);
    });
  });

  describe('formatUsagePair', () => {
    it('joins used and limit labels', () => {
      expect(formatUsagePair(30 * 60_000, 60 * 60_000)).toBe('30m / 1h');
    });
  });
});
