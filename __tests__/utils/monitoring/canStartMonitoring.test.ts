/** @format */

const mockAreAllPermissionsGranted = jest.fn(() => true);

jest.mock('@/domain/permissionSnapshot', () => ({
  areAllPermissionsGranted: () => mockAreAllPermissionsGranted(),
}));

import { canStartMonitoring } from '@/utils/monitoring/canStartMonitoring';

describe('canStartMonitoring', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAreAllPermissionsGranted.mockReturnValue(true);
  });

  it('returns true when all required permissions are granted', () => {
    expect(canStartMonitoring()).toBe(true);
  });

  it('returns false when required permissions are missing', () => {
    mockAreAllPermissionsGranted.mockReturnValue(false);

    expect(canStartMonitoring()).toBe(false);
  });
});
