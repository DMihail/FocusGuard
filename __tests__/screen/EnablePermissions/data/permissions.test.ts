/** @format */

import { createPermissions, PERMISSION_IDS } from '@/screen/EnablePermissions/data/permissions';

describe('permissions data', () => {
  const permissions = createPermissions('Keept');

  it('defines four user-facing permission steps', () => {
    expect(permissions).toHaveLength(4);
  });

  it('includes required permission ids', () => {
    expect(permissions.map((item) => item.id)).toEqual(PERMISSION_IDS);
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
