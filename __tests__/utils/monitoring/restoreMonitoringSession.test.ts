/** @format */

const mockStartMonitorService = jest.fn(() => ({ started: true })) as jest.Mock<
  { started: boolean; reason?: string },
  []
>;
const mockIsMonitorServiceRunning = jest.fn(() => false);
const mockCanStartMonitoring = jest.fn(() => true);

jest.mock('@/specs', () => ({
  isMonitorServiceRunning: () => mockIsMonitorServiceRunning(),
  startMonitorService: () => mockStartMonitorService(),
}));

jest.mock('@/utils/monitoring/canStartMonitoring', () => ({
  canStartMonitoring: () => mockCanStartMonitoring(),
}));

import { monitoringStore, restoreMonitoringSession } from '@/store/monitoringStore';

describe('restoreMonitoringSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStartMonitorService.mockReturnValue({ started: true });
    mockIsMonitorServiceRunning.mockReturnValue(false);
    mockCanStartMonitoring.mockReturnValue(true);
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
    mockCanStartMonitoring.mockReturnValue(false);

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
