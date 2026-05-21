/** @format */

import { PERMISSIONS } from '@/screen/EnablePermissions/data/permissions';

describe('permissions data', () => {
  it('defines three permission items', () => {
    expect(PERMISSIONS).toHaveLength(3);
  });

  it('includes required permission ids and copy', () => {
    expect(PERMISSIONS.map((item) => item.id)).toEqual(['usage-access', 'display-over-apps', 'notifications']);
    expect(PERMISSIONS.map((item) => item.title)).toEqual(['Usage Access', 'Display Over Apps', 'Notifications']);
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
