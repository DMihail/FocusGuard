/** @format */

import { resolveFontFamily, resolveFontWeight } from '@/theme/fonts.ios';

describe('resolveFontFamily (iOS)', () => {
  it('uses Inter on iOS', () => {
    expect(resolveFontFamily('medium')).toBe('Inter');
    expect(resolveFontWeight('medium')).toBe('500');
  });
});
