/** @format */

const mockAreAllPermissionsGranted = jest.fn();

jest.mock('@/domain/permissionSnapshot', () => ({
  areAllPermissionsGranted: () => mockAreAllPermissionsGranted(),
  invalidatePermissionSnapshot: jest.fn(),
}));

import { resolveEntryRoute } from '@/navigation/resolveEntryRoute';

describe('resolveEntryRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAreAllPermissionsGranted.mockReturnValue(false);
  });

  it('returns Onboarding when onboarding is not confirmed', () => {
    expect(resolveEntryRoute(false)).toBe('Onboarding');
  });

  it('returns EnablePermissions when onboarding is confirmed but permissions are missing', () => {
    expect(resolveEntryRoute(true)).toBe('EnablePermissions');
  });

  it('returns Dashboard when onboarding is confirmed and all permissions are granted', () => {
    mockAreAllPermissionsGranted.mockReturnValue(true);

    expect(resolveEntryRoute(true)).toBe('Dashboard');
  });
});
