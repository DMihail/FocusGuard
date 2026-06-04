/** @format */

const mockStartMonitorService = jest.fn();
const mockStopMonitorService = jest.fn();
const mockCanStartMonitoring = jest.fn(() => true);

jest.mock('@/utils/monitoring/canStartMonitoring', () => ({
  canStartMonitoring: () => mockCanStartMonitoring(),
}));

jest.mock('@/specs', () => ({
  startMonitorService: (...args: unknown[]) => mockStartMonitorService(...args),
  stopMonitorService: (...args: unknown[]) => mockStopMonitorService(...args),
}));

jest.mock('@/store/mmkv', () => ({
  zustandStorage: {
    setItem: jest.fn(),
    getItem: jest.fn(() => null),
    removeItem: jest.fn(),
  },
}));

import { monitoringStore } from '@/store/monitoringStore';

describe('monitoringStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCanStartMonitoring.mockReturnValue(true);
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
});
