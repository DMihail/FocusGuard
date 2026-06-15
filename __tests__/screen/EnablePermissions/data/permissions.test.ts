/** @format */

import { Platform } from 'react-native';

import { createPermissions, getPermissionIds } from '@/screen/EnablePermissions/data/permissions';

describe('permissions data', () => {
  const permissions = createPermissions('Keept');

  it('defines platform-specific permission steps', () => {
    expect(permissions).toHaveLength(Platform.OS === 'ios' ? 2 : 4);
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
