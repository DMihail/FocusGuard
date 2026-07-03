/** @format */

import { loadUsageByPackage } from '@/domain/usageStatsCatalog';
import {
  ensureCurrentUsageDay,
  resetTrackedUsageRefreshForTests,
  resetTrackedUsageSeedForTests,
  trackedUsageStore,
} from '@/store/trackedUsageStore';

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
    resetTrackedUsageSeedForTests();
    trackedUsageStore.setState({ usageByPackage: {}, isRefreshingUsage: false });
    ensureCurrentUsageDay();
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

  it('drops deselected app keys on forced refresh', async () => {
    trackedUsageStore.setState({
      usageByPackage: {
        'com.social.chat': 1_000,
        'com.game.puzzle': 2_000,
      },
    });

    mockedLoadUsageByPackage.mockResolvedValue({
      'com.social.chat': 1_500,
    });

    await trackedUsageStore.getState().refreshUsage(['com.social.chat'], true);

    expect(trackedUsageStore.getState().usageByPackage).toEqual({
      'com.social.chat': 1_500,
    });
  });

  it('clears cached usage when the local day changes', async () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 5, 22, 23, 59, 0));

    trackedUsageStore.setState({
      usageByPackage: {
        'com.social.chat': 1_000,
      },
    });

    ensureCurrentUsageDay();

    mockedLoadUsageByPackage.mockResolvedValue({
      'com.social.chat': 0,
    });

    jest.setSystemTime(new Date(2026, 5, 23, 0, 1, 0));

    await trackedUsageStore.getState().refreshUsage(['com.social.chat'], false);

    expect(trackedUsageStore.getState().usageByPackage).toEqual({
      'com.social.chat': 0,
    });

    jest.useRealTimers();
  });

  it('coalesces concurrent refresh requests into a single native load', async () => {
    mockedLoadUsageByPackage.mockResolvedValue({
      'com.social.chat': 2_000,
      'com.game.puzzle': 3_000,
    });

    await Promise.all([
      trackedUsageStore.getState().refreshUsage(['com.social.chat']),
      trackedUsageStore.getState().refreshUsage(['com.game.puzzle']),
    ]);

    expect(mockedLoadUsageByPackage).toHaveBeenCalledTimes(1);
    expect(mockedLoadUsageByPackage).toHaveBeenCalledWith(
      expect.arrayContaining(['com.social.chat', 'com.game.puzzle']),
      false,
    );
    expect(trackedUsageStore.getState().usageByPackage).toEqual({
      'com.social.chat': 2_000,
      'com.game.puzzle': 3_000,
    });
  });

  it('upgrades a coalesced refresh to forced when any caller requests force', async () => {
    mockedLoadUsageByPackage.mockResolvedValue({
      'com.social.chat': 2_000,
    });

    await Promise.all([
      trackedUsageStore.getState().refreshUsage(['com.social.chat'], false),
      trackedUsageStore.getState().refreshUsage(['com.social.chat'], true),
    ]);

    expect(mockedLoadUsageByPackage).toHaveBeenCalledTimes(1);
    expect(mockedLoadUsageByPackage).toHaveBeenCalledWith(['com.social.chat'], true);
  });

  it('keeps isRefreshingUsage true until all concurrent refreshes finish', async () => {
    mockedLoadUsageByPackage.mockResolvedValue({
      'com.social.chat': 2_000,
      'com.game.puzzle': 3_000,
    });

    const first = trackedUsageStore.getState().refreshUsage(['com.social.chat']);
    const second = trackedUsageStore.getState().refreshUsage(['com.game.puzzle']);

    expect(trackedUsageStore.getState().isRefreshingUsage).toBe(true);

    await Promise.all([first, second]);

    expect(trackedUsageStore.getState().isRefreshingUsage).toBe(false);
  });
});
