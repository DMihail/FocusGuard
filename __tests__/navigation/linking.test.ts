/** @format */

import { parseDeepLink } from '@/navigation/parseDeepLink';

describe('parseDeepLink', () => {
  it('parses dashboard URL', () => {
    expect(parseDeepLink('focusguard://dashboard')).toEqual({ screen: 'Dashboard' });
  });

  it('parses configure limits URL with package name', () => {
    expect(parseDeepLink('focusguard://configure/com.instagram.android')).toEqual({
      screen: 'ConfigureLimits',
      params: { packageName: 'com.instagram.android' },
    });
  });

  it('parses tracked apps URL', () => {
    expect(parseDeepLink('focusguard://tracked-apps')).toEqual({ screen: 'TrackedApps' });
  });

  it('returns null for unknown URLs', () => {
    expect(parseDeepLink('focusguard://settings')).toBeNull();
    expect(parseDeepLink(null)).toBeNull();
  });
});
