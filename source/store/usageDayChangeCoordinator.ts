import { reportError } from '@/crashlytics/reportError';

const pendingDayChangeKeys = new Set<string>();

/** Runs at most one day-change refresh per [dayKey] at a time across all screens. */
export const runCoalescedLocalDayChangeRefresh = (dayKey: string, refresh: () => void | Promise<void>): void => {
  if (pendingDayChangeKeys.has(dayKey)) {
    return;
  }

  pendingDayChangeKeys.add(dayKey);

  Promise.resolve(refresh())
    .catch(reportError)
    .finally(() => {
      pendingDayChangeKeys.delete(dayKey);
    });
};

/** @internal */
export const resetLocalDayChangeRefreshCoordinatorForTests = (): void => {
  pendingDayChangeKeys.clear();
};
