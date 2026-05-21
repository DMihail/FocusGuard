/** @format */

import { PERMISSIONS } from '@/screen/EnablePermissions/data/permissions';

describe('permissions data', () => {
  it('defines four user-facing permission steps', () => {
    expect(PERMISSIONS).toHaveLength(4);
  });

  it('includes required permission ids', () => {
    expect(PERMISSIONS.map((item) => item.id)).toEqual([
      'usage-access',
      'display-over-apps',
      'notifications',
      'battery-optimization',
    ]);
  });

  it('starts every permission in pending state', () => {
    expect(PERMISSIONS.every((item) => item.status === 'pending')).toBe(true);
  });

  it('provides an icon component for each permission', () => {
    PERMISSIONS.forEach((item) => {
      expect(typeof item.Icon).toBe('function');
    });
  });
});
