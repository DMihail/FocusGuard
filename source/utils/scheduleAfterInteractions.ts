/** @format */

const isTestEnvironment = typeof jest !== 'undefined';

type GlobalWithIdleCallback = typeof globalThis & {
  requestIdleCallback: (callback: () => void, options?: { timeout?: number }) => number;
};

/** Ensures idle work still runs if the main thread stays busy (e.g. during navigation). */
const IDLE_TIMEOUT_MS = 2_000;

const scheduleIdle = (globalThis as GlobalWithIdleCallback).requestIdleCallback;

/** Defers work until the JS thread is idle so navigation and animations stay smooth. */
export const scheduleAfterInteractions = (callback: () => void): void => {
  if (isTestEnvironment) {
    callback();
    return;
  }

  scheduleIdle(
    () => {
      callback();
    },
    { timeout: IDLE_TIMEOUT_MS },
  );
};
