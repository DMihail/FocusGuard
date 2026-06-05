/** @format */

const mockCheckForPermission = jest.fn(() => true);
const mockCheckForSystemAlertWindowPermission = jest.fn(() => true);
const mockCheckForManifestMonitorPermissions = jest.fn(() => true);

jest.mock('@/specs', () => ({
  checkForPermission: () => mockCheckForPermission(),
  checkForSystemAlertWindowPermission: () => mockCheckForSystemAlertWindowPermission(),
  checkForManifestMonitorPermissions: () => mockCheckForManifestMonitorPermissions(),
}));

import { canStartMonitoring } from '@/utils/monitoring/canStartMonitoring';

describe('canStartMonitoring', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckForPermission.mockReturnValue(true);
    mockCheckForSystemAlertWindowPermission.mockReturnValue(true);
    mockCheckForManifestMonitorPermissions.mockReturnValue(true);
  });

  it('returns true when all required permissions are granted', () => {
    expect(canStartMonitoring()).toBe(true);
  });

  it('returns false when usage access is missing', () => {
    mockCheckForPermission.mockReturnValue(false);

    expect(canStartMonitoring()).toBe(false);
  });

  it('returns false when overlay permission is missing', () => {
    mockCheckForSystemAlertWindowPermission.mockReturnValue(false);

    expect(canStartMonitoring()).toBe(false);
  });

  it('returns false when manifest monitor permissions are missing', () => {
    mockCheckForManifestMonitorPermissions.mockReturnValue(false);

    expect(canStartMonitoring()).toBe(false);
  });
});
