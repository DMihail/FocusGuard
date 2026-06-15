/** @format */

import { createPermissions, getPermissionIds } from '@/screen/EnablePermissions/data/permissions';

describe('permissions data (iOS)', () => {
  const permissions = createPermissions('Keept');

  it('defines iOS permission steps', () => {
    expect(permissions).toHaveLength(2);
  });

  it('includes required permission ids', () => {
    expect(permissions.map((item) => item.id)).toEqual(getPermissionIds());
  });

  it('starts every permission in pending state', () => {
    expect(permissions.every((item) => item.status === 'pending')).toBe(true);
  });

  it('provides an icon component for each permission', () => {
    permissions.forEach((item) => {
      expect(typeof item.Icon).toBe('function');
    });
  });
});
