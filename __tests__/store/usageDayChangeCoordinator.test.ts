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

  it('allows a later day key refresh after an overlapping earlier refresh completes', async () => {
    let resolveFirst: (() => void) | undefined;
    const firstRefresh = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveFirst = resolve;
        }),
    );
    const secondRefresh = jest.fn();

    runCoalescedLocalDayChangeRefresh('2026-7-1', firstRefresh);
    runCoalescedLocalDayChangeRefresh('2026-7-2', secondRefresh);

    expect(firstRefresh).toHaveBeenCalledTimes(1);
    expect(secondRefresh).toHaveBeenCalledTimes(1);

    resolveFirst?.();
    await Promise.resolve();
    await new Promise<void>((resolve) => setImmediate(resolve));

    runCoalescedLocalDayChangeRefresh('2026-7-2', secondRefresh);

    expect(secondRefresh).toHaveBeenCalledTimes(2);
  });
});
