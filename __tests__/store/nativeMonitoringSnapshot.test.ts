/** @format */

const mockSet = jest.fn();
const mockSyncMonitoringState = jest.fn();

jest.mock('@/store/mmkv', () => ({
  storage: {
    set: (...args: unknown[]) => mockSet(...args),
  },
  zustandStorage: require('../helpers/mockZustandMmkv').mockZustandStorage,
}));

jest.mock('@/specs/keeptTurboModuleClient', () => ({
  getKeeptTurboModule: jest.fn(),
}));

import { getKeeptTurboModule } from '@/specs/keeptTurboModuleClient';
import { monitoringStore } from '@/store/monitoringStore';
import {
  buildMonitoringSnapshot,
  resetNativeMonitoringSnapshotSyncForTests,
  syncNativeMonitoringSnapshot,
} from '@/store/nativeMonitoringSnapshot';
import { NATIVE_MONITORING_SNAPSHOT_KEY } from '@/store/persistSchema';

const mockGetKeeptTurboModule = getKeeptTurboModule as jest.MockedFunction<typeof getKeeptTurboModule>;

describe('nativeMonitoringSnapshot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetNativeMonitoringSnapshotSyncForTests();
    monitoringStore.setState({ isMonitoring: false });
    mockGetKeeptTurboModule.mockReturnValue({ syncMonitoringState: mockSyncMonitoringState } as never);
  });

  it('writes a flat snapshot through syncMonitoringState when the turbo module is available', () => {
    monitoringStore.setState({ isMonitoring: true });

    syncNativeMonitoringSnapshot();

    expect(mockSyncMonitoringState).toHaveBeenCalledWith(JSON.stringify(buildMonitoringSnapshot()));
    expect(mockSet).not.toHaveBeenCalled();
  });

  it('falls back to MMKV when the turbo module is unavailable', () => {
    mockGetKeeptTurboModule.mockReturnValue(null);

    syncNativeMonitoringSnapshot();

    expect(mockSet).toHaveBeenCalledWith(NATIVE_MONITORING_SNAPSHOT_KEY, JSON.stringify(buildMonitoringSnapshot()));
    expect(mockSyncMonitoringState).not.toHaveBeenCalled();
  });
});
