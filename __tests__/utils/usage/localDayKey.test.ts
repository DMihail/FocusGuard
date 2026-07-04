import { compareLocalDayKeys, getLocalDayKey, parseLocalDayKey } from '@/utils/usage/localDayKey';

describe('localDayKey', () => {
  it('builds a stable key from the local calendar date', () => {
    expect(getLocalDayKey(new Date(2026, 5, 22, 15, 30))).toBe('2026-6-22');
  });

  it('parses and compares day keys chronologically', () => {
    expect(parseLocalDayKey('2026-6-22')).toBeGreaterThan(parseLocalDayKey('2026-6-20'));
    expect(compareLocalDayKeys('2026-6-20', '2026-10-5')).toBeGreaterThan(0);
    expect(compareLocalDayKeys('2026-10-5', '2026-6-20')).toBeLessThan(0);
  });

  it('treats malformed day keys as equal when comparing', () => {
    expect(compareLocalDayKeys('invalid', 'also-invalid')).toBe(0);
  });
});
