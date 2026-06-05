/** @format */

import { matchDeepLinkPath, parseDeepLinkUrl } from '@/navigation/linking';

describe('deep link parsing', () => {
  it('parses dashboard path', () => {
    expect(matchDeepLinkPath('dashboard')).toEqual({ screen: 'Dashboard' });
    expect(parseDeepLinkUrl('focusguard://dashboard')).toEqual({ screen: 'Dashboard' });
  });

  it('parses configure limits path with package name', () => {
    const target = {
      screen: 'ConfigureLimits' as const,
      params: { packageName: 'com.instagram.android' },
    };

    expect(matchDeepLinkPath('configure/com.instagram.android')).toEqual(target);
    expect(parseDeepLinkUrl('focusguard://configure/com.instagram.android')).toEqual(target);
  });

  it('parses tracked apps path', () => {
    expect(matchDeepLinkPath('tracked-apps')).toEqual({ screen: 'TrackedApps' });
    expect(parseDeepLinkUrl('focusguard://tracked-apps')).toEqual({ screen: 'TrackedApps' });
  });

  it('returns null for unknown paths', () => {
    expect(matchDeepLinkPath('settings')).toBeNull();
    expect(parseDeepLinkUrl('focusguard://settings')).toBeNull();
    expect(parseDeepLinkUrl(null)).toBeNull();
  });
});
