/** @format */

import { formatUsageMinutes, formatUsagePair } from '@/utils/usage/formatUsage';

describe('formatUsage', () => {
  describe('formatUsageMinutes', () => {
    it('formats sub-hour usage in minutes', () => {
      expect(formatUsageMinutes(45 * 60_000)).toBe('45m');
    });

    it('formats whole hours without remainder', () => {
      expect(formatUsageMinutes(2 * 60 * 60_000)).toBe('2h');
    });

    it('formats hours with remainder', () => {
      expect(formatUsageMinutes((2 * 60 + 15) * 60_000)).toBe('2h 15m');
    });

    it('clamps negative values to zero minutes', () => {
      expect(formatUsageMinutes(-1000)).toBe('0m');
    });
  });

  describe('formatUsagePair', () => {
    it('joins used and limit labels', () => {
      expect(formatUsagePair(30 * 60_000, 60 * 60_000)).toBe('30m / 1h');
    });
  });
});
