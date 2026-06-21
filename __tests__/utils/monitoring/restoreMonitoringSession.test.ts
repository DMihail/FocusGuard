/** @format */

const mockStartMonitorService = jest.fn(() => ({ started: true })) as jest.Mock<
  { started: boolean; reason?: string },
  []
>;
const mockIsMonitorServiceRunning = jest.fn(() => false);
const mockAreAllPermissionsGranted = jest.fn(() => true);

jest.mock('@/domain/permissionSnapshot', () => ({
  areAllPermissionsGranted: () => mockAreAllPermissionsGranted(),
}));

jest.mock('@/specs', () => ({
  isMonitorServiceRunning: () => mockIsMonitorServiceRunning(),
  startMonitorService: () => mockStartMonitorService(),
}));

import { monitoringStore, restoreMonitoringSession } from '@/store/monitoringStore';

describe('restoreMonitoringSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStartMonitorService.mockReturnValue({ started: true });
    mockIsMonitorServiceRunning.mockReturnValue(false);
    mockAreAllPermissionsGranted.mockReturnValue(true);
    monitoringStore.setState({ isMonitoring: false });
  });

  it('starts the monitor service when monitoring is persisted but the service is not running', () => {
    monitoringStore.setState({ isMonitoring: true });

    restoreMonitoringSession();

    expect(mockStartMonitorService).toHaveBeenCalledTimes(1);
    expect(monitoringStore.getState().isMonitoring).toBe(true);
  });

  it('clears monitoring when required permissions are missing', () => {
    monitoringStore.setState({ isMonitoring: true });
    mockAreAllPermissionsGranted.mockReturnValue(false);

    restoreMonitoringSession();

    expect(mockStartMonitorService).not.toHaveBeenCalled();
    expect(monitoringStore.getState().isMonitoring).toBe(false);
  });

  it('clears monitoring when startMonitorService reports failure', () => {
    monitoringStore.setState({ isMonitoring: true });
    mockStartMonitorService.mockReturnValue({ started: false, reason: 'usage_access_missing' });

    restoreMonitoringSession();

    expect(mockStartMonitorService).toHaveBeenCalledTimes(1);
    expect(monitoringStore.getState().isMonitoring).toBe(false);
  });

  it('does nothing when the monitor service is already running', () => {
    monitoringStore.setState({ isMonitoring: true });
    mockIsMonitorServiceRunning.mockReturnValue(true);

    restoreMonitoringSession();

    expect(mockStartMonitorService).not.toHaveBeenCalled();
    expect(monitoringStore.getState().isMonitoring).toBe(true);
  });
});
