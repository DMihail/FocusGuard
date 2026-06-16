/** @format */

import { act } from 'react-test-renderer';

const mockStartMonitorService = jest.fn(() => ({ started: true })) as jest.Mock<
  { started: boolean; reason?: string },
  []
>;
const mockStopMonitorService = jest.fn();
const mockIsMonitorServiceRunning = jest.fn(() => false);
const mockCanStartMonitoring = jest.fn(() => true);

jest.mock('@/utils/monitoring/canStartMonitoring', () => ({
  canStartMonitoring: () => mockCanStartMonitoring(),
}));

jest.mock('@/specs', () => ({
  startMonitorService: () => mockStartMonitorService(),
  stopMonitorService: (...args: unknown[]) => mockStopMonitorService(...args),
  isMonitorServiceRunning: () => mockIsMonitorServiceRunning(),
}));

const mockGetItem = jest.fn((_name: string): string | null => null);

jest.mock('@/store/mmkv', () => ({
  zustandStorage: {
    setItem: jest.fn(),
    getItem: (name: string) => mockGetItem(name),
    removeItem: jest.fn(),
  },
}));

import { monitoringStore } from '@/store/monitoringStore';

describe('monitoringStore', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockCanStartMonitoring.mockReturnValue(true);
    mockStartMonitorService.mockReturnValue({ started: true });
    mockIsMonitorServiceRunning.mockReturnValue(true);
    mockGetItem.mockReturnValue(null);
    await monitoringStore.persist.clearStorage();
    monitoringStore.setState({ isMonitoring: false });
  });

  it('starts with monitoring disabled', () => {
    expect(monitoringStore.getState().isMonitoring).toBe(false);
  });

  it('calls startMonitorService and sets isMonitoring to true on first toggle', () => {
    monitoringStore.getState().toggle();

    expect(mockStartMonitorService).toHaveBeenCalledTimes(1);
    expect(mockStopMonitorService).not.toHaveBeenCalled();
    expect(monitoringStore.getState().isMonitoring).toBe(true);
  });

  it('does not enable monitoring when startMonitorService reports failure', () => {
    mockStartMonitorService.mockReturnValue({ started: false, reason: 'usage_access_missing' });

    monitoringStore.getState().toggle();

    expect(mockStartMonitorService).toHaveBeenCalledTimes(1);
    expect(monitoringStore.getState().isMonitoring).toBe(false);
  });

  it('rolls back monitoring when the service fails to start', () => {
    mockIsMonitorServiceRunning.mockReturnValue(false);

    monitoringStore.getState().toggle();

    expect(mockStartMonitorService).toHaveBeenCalledTimes(1);
    expect(monitoringStore.getState().isMonitoring).toBe(false);
  });

  it('calls stopMonitorService and sets isMonitoring to false on second toggle', () => {
    monitoringStore.setState({ isMonitoring: true });

    monitoringStore.getState().toggle();

    expect(mockStopMonitorService).toHaveBeenCalledTimes(1);
    expect(mockStartMonitorService).not.toHaveBeenCalled();
    expect(monitoringStore.getState().isMonitoring).toBe(false);
  });

  it('does not enable monitoring when required permissions are missing', () => {
    mockCanStartMonitoring.mockReturnValue(false);

    monitoringStore.getState().toggle();

    expect(mockStartMonitorService).not.toHaveBeenCalled();
    expect(monitoringStore.getState().isMonitoring).toBe(false);
  });

  it('toggles back and forth correctly', () => {
    const { toggle } = monitoringStore.getState();

    toggle();
    expect(monitoringStore.getState().isMonitoring).toBe(true);
    expect(mockStartMonitorService).toHaveBeenCalledTimes(1);

    monitoringStore.getState().toggle();
    expect(monitoringStore.getState().isMonitoring).toBe(false);
    expect(mockStopMonitorService).toHaveBeenCalledTimes(1);
  });

  it('restarts monitor service after rehydrate when monitoring was enabled', async () => {
    mockIsMonitorServiceRunning.mockReturnValue(false);
    mockGetItem.mockReturnValue(JSON.stringify({ state: { isMonitoring: true }, version: 0 }));

    await act(async () => {
      await monitoringStore.persist.rehydrate();
    });

    expect(mockStartMonitorService).toHaveBeenCalledTimes(1);
    expect(monitoringStore.getState().isMonitoring).toBe(true);
  });

  it('disables monitoring after rehydrate when permissions are missing', async () => {
    mockIsMonitorServiceRunning.mockReturnValue(false);
    mockCanStartMonitoring.mockReturnValue(false);
    mockGetItem.mockReturnValue(JSON.stringify({ state: { isMonitoring: true }, version: 0 }));

    await act(async () => {
      await monitoringStore.persist.rehydrate();
    });

    expect(mockStartMonitorService).not.toHaveBeenCalled();
    expect(monitoringStore.getState().isMonitoring).toBe(false);
  });
});
