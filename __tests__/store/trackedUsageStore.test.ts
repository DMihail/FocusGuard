/** @format */

import { loadUsageByPackage } from '@/domain/usageStatsCatalog';
import { trackedUsageStore } from '@/store/trackedUsageStore';

jest.mock('@/domain/usageStatsCatalog', () => ({
  getCachedUsageByPackage: jest.fn(() => null),
  invalidateUsageStatsCache: jest.fn(),
  loadUsageByPackage: jest.fn(),
}));

jest.mock('@/domain/installedAppsCatalog', () => ({
  invalidateInstalledAppsCache: jest.fn(),
  loadInstalledApps: jest.fn(),
}));

const mockedLoadUsageByPackage = loadUsageByPackage as jest.MockedFunction<typeof loadUsageByPackage>;

describe('trackedUsageStore.refreshUsage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    trackedUsageStore.setState({ usageByPackage: {}, isRefreshingUsage: false });
  });

  it('merges partial usage updates instead of replacing the full map', async () => {
    trackedUsageStore.setState({
      usageByPackage: {
        'com.social.chat': 1_000,
        'com.game.puzzle': 2_000,
      },
    });

    mockedLoadUsageByPackage.mockResolvedValue({
      'com.social.chat': 1_500,
    });

    await trackedUsageStore.getState().refreshUsage(['com.social.chat']);

    expect(trackedUsageStore.getState().usageByPackage).toEqual({
      'com.social.chat': 1_500,
      'com.game.puzzle': 2_000,
    });
  });
});
