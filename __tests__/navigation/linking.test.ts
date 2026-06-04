/** @format */

import { buildConfigureLimitsDeepLink, buildDashboardDeepLink, DEEP_LINK_PREFIX, linking } from '@/navigation/linking';

describe('navigation linking', () => {
  it('uses focusguard scheme prefix', () => {
    expect(linking.prefixes).toContain(DEEP_LINK_PREFIX);
  });

  it('maps notification targets to stack screens', () => {
    expect(linking.config?.screens).toMatchObject({
      Dashboard: 'dashboard',
      ConfigureLimits: 'configure/:packageName',
    });
  });

  it('builds dashboard deep link', () => {
    expect(buildDashboardDeepLink()).toBe('focusguard://dashboard');
  });

  it('builds configure limits deep link with encoded package name', () => {
    expect(buildConfigureLimitsDeepLink('com.example/app')).toBe('focusguard://configure/com.example%2Fapp');
  });
});
