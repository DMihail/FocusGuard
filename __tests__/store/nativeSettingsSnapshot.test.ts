/** @format */

const mockSet = jest.fn();
const mockSyncSettingsConfig = jest.fn();

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
import {
  buildSettingsSnapshot,
  resetNativeSettingsSnapshotSyncForTests,
  syncNativeSettingsSnapshot,
} from '@/store/nativeSettingsSnapshot';
import { NATIVE_SETTINGS_SNAPSHOT_KEY } from '@/store/persistSchema';
import { settingsStore } from '@/store/settingsStore';

const mockGetKeeptTurboModule = getKeeptTurboModule as jest.MockedFunction<typeof getKeeptTurboModule>;

describe('nativeSettingsSnapshot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetNativeSettingsSnapshotSyncForTests();
    settingsStore.setState({
      notificationsEnabled: true,
      themePreference: 'system',
      languagePreference: 'system',
    });
    mockGetKeeptTurboModule.mockReturnValue({ syncSettingsConfig: mockSyncSettingsConfig } as never);
  });

  it('writes a flat snapshot through syncSettingsConfig when the turbo module is available', () => {
    settingsStore.setState({ notificationsEnabled: false, themePreference: 'dark' });

    syncNativeSettingsSnapshot();

    expect(mockSyncSettingsConfig).toHaveBeenCalledWith(JSON.stringify(buildSettingsSnapshot()));
    expect(mockSet).not.toHaveBeenCalled();
  });

  it('falls back to MMKV when the turbo module is unavailable', () => {
    mockGetKeeptTurboModule.mockReturnValue(null);

    syncNativeSettingsSnapshot();

    expect(mockSet).toHaveBeenCalledWith(NATIVE_SETTINGS_SNAPSHOT_KEY, JSON.stringify(buildSettingsSnapshot()));
    expect(mockSyncSettingsConfig).not.toHaveBeenCalled();
  });
});
