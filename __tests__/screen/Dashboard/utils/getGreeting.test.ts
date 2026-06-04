/** @format */

import { getGreeting } from '@/screen/Dashboard/utils';

describe('getGreeting', () => {
  it('returns Good morning before noon', () => {
    expect(getGreeting(new Date('2026-06-04T09:00:00'))).toBe('Good morning');
  });

  it('returns Good afternoon before evening', () => {
    expect(getGreeting(new Date('2026-06-04T14:00:00'))).toBe('Good afternoon');
  });

  it('returns Good evening at night', () => {
    expect(getGreeting(new Date('2026-06-04T20:00:00'))).toBe('Good evening');
  });
});
