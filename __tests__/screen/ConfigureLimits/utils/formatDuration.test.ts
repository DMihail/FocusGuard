/** @format */

import { formatDurationMinutes } from '@/screen/ConfigureLimits/utils/formatDuration';

describe('formatDurationMinutes', () => {
  it('formats sub-hour values in minutes', () => {
    expect(formatDurationMinutes(45)).toBe('45m');
  });

  it('formats whole hours', () => {
    expect(formatDurationMinutes(120)).toBe('2h');
  });

  it('formats hours with remainder', () => {
    expect(formatDurationMinutes(90)).toBe('1h 30m');
  });
});
