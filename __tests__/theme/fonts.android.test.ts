/** @format */

import { resolveFontFamily, resolveFontWeight } from '@/theme/fonts.android';

describe('resolveFontFamily (Android)', () => {
  it('uses per-weight file names on Android', () => {
    expect(resolveFontFamily('regular')).toBe('Inter-Regular');
    expect(resolveFontFamily('bold')).toBe('Inter-Bold');
    expect(resolveFontWeight('bold')).toBe('normal');
  });
});
