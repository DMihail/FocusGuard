import { reportError } from '@/crashlytics/reportError';

let activeDayChangeRefresh: Promise<void> | null = null;
let activeDayChangeKey: string | null = null;

/** Runs at most one day-change refresh per [dayKey] at a time across all screens. */
export const runCoalescedLocalDayChangeRefresh = (dayKey: string, refresh: () => void | Promise<void>): void => {
  if (activeDayChangeKey === dayKey && activeDayChangeRefresh) {
    return;
  }

  activeDayChangeKey = dayKey;
  activeDayChangeRefresh = Promise.resolve(refresh()).finally(() => {
    activeDayChangeRefresh = null;
  });

  activeDayChangeRefresh.catch(reportError);
};

/** @internal */
export const resetLocalDayChangeRefreshCoordinatorForTests = (): void => {
  activeDayChangeRefresh = null;
  activeDayChangeKey = null;
};
