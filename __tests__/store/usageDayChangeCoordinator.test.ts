/** @format */

import {
  resetLocalDayChangeRefreshCoordinatorForTests,
  runCoalescedLocalDayChangeRefresh,
} from '@/store/usageDayChangeCoordinator';

describe('usageDayChangeCoordinator', () => {
  beforeEach(() => {
    resetLocalDayChangeRefreshCoordinatorForTests();
  });

  it('runs only one refresh per day key while in flight', async () => {
    const refresh = jest.fn(async () => {
      await Promise.resolve();
    });

    runCoalescedLocalDayChangeRefresh('2026-7-2', refresh);
    runCoalescedLocalDayChangeRefresh('2026-7-2', refresh);

    await Promise.resolve();

    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('runs again when the day key changes', async () => {
    const refresh = jest.fn(async () => {
      await Promise.resolve();
    });

    runCoalescedLocalDayChangeRefresh('2026-7-1', refresh);
    await Promise.resolve();

    runCoalescedLocalDayChangeRefresh('2026-7-2', refresh);
    await Promise.resolve();

    expect(refresh).toHaveBeenCalledTimes(2);
  });
});
