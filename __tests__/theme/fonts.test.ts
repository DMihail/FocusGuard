/** @format */

import { Platform } from 'react-native';

import { resolveFontFamily, resolveFontWeight } from '@/theme/fonts';

describe('resolveFontFamily', () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: originalOS });
  });

  it('uses Inter on iOS', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'ios' });

    expect(resolveFontFamily('medium')).toBe('Inter');
    expect(resolveFontWeight('medium')).toBe('500');
  });

  it('uses per-weight file names on Android', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });

    expect(resolveFontFamily('regular')).toBe('Inter-Regular');
    expect(resolveFontFamily('bold')).toBe('Inter-Bold');
    expect(resolveFontWeight('bold')).toBe('normal');
  });
});
