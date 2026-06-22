/** @format */

import { loadUsageByPackage } from '@/domain/usageStatsCatalog';
import { resetTrackedUsageRefreshForTests, trackedUsageStore } from '@/store/trackedUsageStore';

jest.mock('@/domain/usageStatsCatalog', () => ({
  getCachedUsageByPackage: jest.fn(() => null),
  invalidateUsageStatsCache: jest.fn(),
  loadUsageByPackage: jest.fn(),
}));

const mockedLoadUsageByPackage = loadUsageByPackage as jest.MockedFunction<typeof loadUsageByPackage>;

describe('trackedUsageStore.refreshUsage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetTrackedUsageRefreshForTests();
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

  it('ignores refresh calls with no selected app keys', async () => {
    trackedUsageStore.setState({
      usageByPackage: {
        'com.social.chat': 1_000,
      },
    });

    await trackedUsageStore.getState().refreshUsage([]);

    expect(mockedLoadUsageByPackage).not.toHaveBeenCalled();
    expect(trackedUsageStore.getState().usageByPackage).toEqual({
      'com.social.chat': 1_000,
    });
  });

  it('keeps isRefreshingUsage true until all concurrent refreshes finish', async () => {
    let resolveFirst: (value: Record<string, number>) => void = () => undefined;
    let resolveSecond: (value: Record<string, number>) => void = () => undefined;
    const firstRefresh = new Promise<Record<string, number>>((resolve) => {
      resolveFirst = resolve;
    });
    const secondRefresh = new Promise<Record<string, number>>((resolve) => {
      resolveSecond = resolve;
    });

    mockedLoadUsageByPackage.mockReturnValueOnce(firstRefresh).mockReturnValueOnce(secondRefresh);

    const first = trackedUsageStore.getState().refreshUsage(['com.social.chat']);
    const second = trackedUsageStore.getState().refreshUsage(['com.game.puzzle']);

    expect(trackedUsageStore.getState().isRefreshingUsage).toBe(true);

    resolveFirst({ 'com.social.chat': 2_000 });
    await Promise.resolve();

    expect(trackedUsageStore.getState().isRefreshingUsage).toBe(true);

    resolveSecond({ 'com.game.puzzle': 3_000 });
    await Promise.all([first, second]);

    expect(trackedUsageStore.getState().isRefreshingUsage).toBe(false);
  });
});
