/** @format */

import { useCallback, useRef } from 'react';

import { reportError } from '@/crashlytics/reportError';

/** Runs async work at most once at a time; coalesces overlapping calls into one follow-up run. */
export const useCoalescedAsyncRunner = (runTask: () => void | Promise<void>): (() => void) => {
  const taskRef = useRef(runTask);
  taskRef.current = runTask;

  const inFlightRef = useRef<Promise<void> | null>(null);
  const hasPendingRef = useRef(false);
  const runRef = useRef<() => void>(() => {});

  runRef.current = () => {
    if (inFlightRef.current) {
      hasPendingRef.current = true;
      return;
    }

    inFlightRef.current = Promise.resolve()
      .then(() => taskRef.current())
      .catch(reportError)
      .finally(() => {
        inFlightRef.current = null;

        if (hasPendingRef.current) {
          hasPendingRef.current = false;
          runRef.current();
        }
      });
  };

  return useCallback(() => {
    runRef.current();
  }, []);
};
