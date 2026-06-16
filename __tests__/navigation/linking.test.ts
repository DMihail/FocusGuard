/** @format */

import { buildRootNavigationStateFromPath, matchDeepLinkPath, parseDeepLinkUrl } from '@/navigation/linking';

describe('deep link parsing', () => {
  it('parses dashboard path', () => {
    expect(matchDeepLinkPath('dashboard')).toEqual({ screen: 'Dashboard' });
    expect(parseDeepLinkUrl('keept://dashboard')).toEqual({ screen: 'Dashboard' });
    expect(parseDeepLinkUrl('focusguard://dashboard')).toEqual({ screen: 'Dashboard' });
  });

  it('parses configure limits path with package name', () => {
    const target = {
      screen: 'ConfigureLimits' as const,
      params: { appKey: 'com.instagram.android' },
    };

    expect(matchDeepLinkPath('configure/com.instagram.android')).toEqual(target);
    expect(parseDeepLinkUrl('keept://configure/com.instagram.android')).toEqual(target);
    expect(parseDeepLinkUrl('focusguard://configure/com.instagram.android')).toEqual(target);
  });

  it('parses tracked apps path', () => {
    expect(matchDeepLinkPath('tracked-apps')).toEqual({ screen: 'TrackedApps' });
    expect(parseDeepLinkUrl('keept://tracked-apps')).toEqual({ screen: 'TrackedApps' });
    expect(parseDeepLinkUrl('focusguard://tracked-apps')).toEqual({ screen: 'TrackedApps' });
  });

  it('returns null for unknown paths', () => {
    expect(matchDeepLinkPath('settings')).toBeNull();
    expect(parseDeepLinkUrl('keept://settings')).toBeNull();
    expect(parseDeepLinkUrl('focusguard://settings')).toBeNull();
    expect(parseDeepLinkUrl(null)).toBeNull();
  });

  it('prepends Dashboard for cold-start configure deep links', () => {
    const state = buildRootNavigationStateFromPath('configure/com.instagram.android');

    expect(state).toEqual({
      routes: [
        { name: 'Dashboard' },
        {
          name: 'ConfigureLimits',
          params: { appKey: 'com.instagram.android' },
        },
      ],
      index: 1,
    });
  });

  it('keeps tracked-apps deep link stack navigable from Dashboard', () => {
    const state = buildRootNavigationStateFromPath('tracked-apps');

    expect(state).toEqual({
      routes: [{ name: 'Dashboard' }, { name: 'TrackedApps' }],
      index: 1,
    });
  });

  it('does not prepend Dashboard for dashboard deep links', () => {
    const state = buildRootNavigationStateFromPath('dashboard');

    expect(state).toEqual({
      routes: [{ name: 'Dashboard' }],
      index: 0,
    });
  });
});
