/** @format */

import { act } from 'react-test-renderer';

const mockStartMonitorService = jest.fn(() => ({ started: true })) as jest.Mock<
  { started: boolean; reason?: string },
  []
>;
const mockStopMonitorService = jest.fn();
const mockIsMonitorServiceRunning = jest.fn(() => false);
const mockAreAllPermissionsGranted = jest.fn(() => true);
let monitorServiceStateListener: ((event: { isRunning: boolean; changedAtMs?: number }) => void) | undefined;

const mockSubscribeMonitorServiceStateChanged = jest.fn(
  (listener: (event: { isRunning: boolean; changedAtMs?: number }) => void) => {
    monitorServiceStateListener = listener;
    return { remove: jest.fn() };
  },
);

jest.mock('@/domain/permissionSnapshot', () => ({
  areAllPermissionsGranted: () => mockAreAllPermissionsGranted(),
}));

jest.mock('@/specs', () => ({
  startMonitorService: () => mockStartMonitorService(),
  stopMonitorService: (...args: unknown[]) => mockStopMonitorService(...args),
  isMonitorServiceRunning: () => mockIsMonitorServiceRunning(),
  subscribeMonitorServiceStateChanged: (listener: (event: { isRunning: boolean }) => void) =>
    mockSubscribeMonitorServiceStateChanged(listener),
}));

const mockGetItem = jest.fn((_name: string): string | null => null);

jest.mock('@/store/mmkv', () => ({
  zustandStorage: {
    setItem: jest.fn(),
    getItem: (name: string) => mockGetItem(name),
    removeItem: jest.fn(),
  },
}));

import {
  monitoringStore,
  resetMonitoringStartHealthCheckForTests,
  restoreMonitoringSession,
} from '@/store/monitoringStore';

describe('monitoringStore', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    monitorServiceStateListener = undefined;
    resetMonitoringStartHealthCheckForTests();
    mockAreAllPermissionsGranted.mockReturnValue(true);
    mockStartMonitorService.mockReturnValue({ started: true });
    mockIsMonitorServiceRunning.mockReturnValue(true);
    mockGetItem.mockReturnValue(null);
    await monitoringStore.persist.clearStorage();
    monitoringStore.setState({ isMonitoring: false });
  });

  it('calls startMonitorService and sets isMonitoring to true on first toggle', () => {
    monitoringStore.getState().toggle();

    expect(mockStartMonitorService).toHaveBeenCalledTimes(1);
    expect(mockStopMonitorService).not.toHaveBeenCalled();
    expect(monitoringStore.getState().isMonitoring).toBe(true);
  });

  it('does not enable monitoring when startMonitorService reports failure', () => {
    mockStartMonitorService.mockReturnValue({ started: false, reason: 'usage_access_missing' });

    const result = monitoringStore.getState().toggle();

    expect(result).toEqual({
      ok: false,
      reason: 'service_start_failed',
      detail: 'usage_access_missing',
    });
    expect(mockStartMonitorService).toHaveBeenCalledTimes(1);
    expect(monitoringStore.getState().isMonitoring).toBe(false);
  });

  it('keeps monitoring enabled while the service is still starting on Android', () => {
    mockIsMonitorServiceRunning.mockReturnValue(false);

    monitoringStore.getState().toggle();

    expect(mockStartMonitorService).toHaveBeenCalledTimes(1);
    expect(mockSubscribeMonitorServiceStateChanged).toHaveBeenCalledTimes(1);
    expect(monitoringStore.getState().isMonitoring).toBe(true);
  });

  it('clears monitoring when native reports the service failed to start', () => {
    mockIsMonitorServiceRunning.mockReturnValue(false);
    const startRequestedAtMs = 5_000;
    jest.spyOn(Date, 'now').mockReturnValue(startRequestedAtMs);

    monitoringStore.getState().toggle();

    act(() => {
      monitorServiceStateListener?.({ isRunning: false, changedAtMs: startRequestedAtMs + 100 });
    });

    expect(monitoringStore.getState().isMonitoring).toBe(false);
  });

  it('ignores stale stop events from a prior service teardown during start health check', () => {
    mockIsMonitorServiceRunning.mockReturnValue(false);
    const startRequestedAtMs = 5_000;
    jest.spyOn(Date, 'now').mockReturnValue(startRequestedAtMs);

    monitoringStore.getState().toggle();

    act(() => {
      monitorServiceStateListener?.({ isRunning: false, changedAtMs: startRequestedAtMs - 100 });
    });

    expect(monitoringStore.getState().isMonitoring).toBe(true);

    act(() => {
      monitorServiceStateListener?.({ isRunning: true, changedAtMs: startRequestedAtMs + 100 });
    });

    expect(monitoringStore.getState().isMonitoring).toBe(true);
  });

  it('does not clear monitoring when stop verification finds the new service already running', () => {
    mockIsMonitorServiceRunning.mockReturnValue(false);

    monitoringStore.getState().toggle();

    mockIsMonitorServiceRunning.mockReturnValue(true);

    act(() => {
      monitorServiceStateListener?.({ isRunning: false, changedAtMs: Date.now() });
    });

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
    mockAreAllPermissionsGranted.mockReturnValue(false);

    const result = monitoringStore.getState().toggle();

    expect(result).toEqual({ ok: false, reason: 'permissions_missing' });
    expect(mockStartMonitorService).not.toHaveBeenCalled();
    expect(monitoringStore.getState().isMonitoring).toBe(false);
  });

  it('restarts monitor service after restore when monitoring was enabled', async () => {
    mockIsMonitorServiceRunning.mockReturnValueOnce(false).mockReturnValue(true);
    mockGetItem.mockReturnValue(JSON.stringify({ state: { isMonitoring: true }, version: 1 }));

    await act(async () => {
      await monitoringStore.persist.rehydrate();
    });

    restoreMonitoringSession();

    expect(mockStartMonitorService).toHaveBeenCalledTimes(1);
    expect(mockSubscribeMonitorServiceStateChanged).toHaveBeenCalledTimes(1);
    expect(monitoringStore.getState().isMonitoring).toBe(true);
  });

  it('disables monitoring on restore when permissions are missing', async () => {
    mockIsMonitorServiceRunning.mockReturnValue(false);
    mockAreAllPermissionsGranted.mockReturnValue(false);
    mockGetItem.mockReturnValue(JSON.stringify({ state: { isMonitoring: true }, version: 1 }));

    await act(async () => {
      await monitoringStore.persist.rehydrate();
    });

    restoreMonitoringSession();

    expect(mockStartMonitorService).not.toHaveBeenCalled();
    expect(monitoringStore.getState().isMonitoring).toBe(false);
  });

  it('does not restart restore when the monitor service is already running', () => {
    monitoringStore.setState({ isMonitoring: true });
    mockIsMonitorServiceRunning.mockReturnValue(true);

    restoreMonitoringSession();

    expect(mockStartMonitorService).not.toHaveBeenCalled();
    expect(monitoringStore.getState().isMonitoring).toBe(true);
  });

  it('clears monitoring on restore when startMonitorService reports failure', () => {
    monitoringStore.setState({ isMonitoring: true });
    mockIsMonitorServiceRunning.mockReturnValue(false);
    mockStartMonitorService.mockReturnValue({ started: false, reason: 'usage_access_missing' });

    restoreMonitoringSession();

    expect(mockStartMonitorService).toHaveBeenCalledTimes(1);
    expect(mockSubscribeMonitorServiceStateChanged).not.toHaveBeenCalled();
    expect(monitoringStore.getState().isMonitoring).toBe(false);
  });

  it('keeps monitoring on when restore is blocked by background FGS rules', () => {
    monitoringStore.setState({ isMonitoring: true });
    mockIsMonitorServiceRunning.mockReturnValue(false);
    mockStartMonitorService.mockReturnValue({ started: false, reason: 'background_start_blocked' });

    restoreMonitoringSession();

    expect(mockStartMonitorService).toHaveBeenCalledTimes(1);
    expect(monitoringStore.getState().isMonitoring).toBe(true);
  });
});
