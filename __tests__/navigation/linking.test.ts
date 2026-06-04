/** @format */

import { DEEP_LINK_PREFIX, linking } from '@/navigation/linking';

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
});
