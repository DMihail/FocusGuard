/** @format */

import { formatDurationMinutes } from '@/utils/usage/formatUsage';

describe('formatDurationMinutes', () => {
  it('formats minutes under one hour', () => {
    expect(formatDurationMinutes(45)).toBe('45m');
  });

  it('formats whole hours', () => {
    expect(formatDurationMinutes(120)).toBe('2h');
  });

  it('formats hours with remainder minutes', () => {
    expect(formatDurationMinutes(90)).toBe('1h 30m');
  });
});
