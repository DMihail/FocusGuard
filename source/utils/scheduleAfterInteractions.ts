const isTestEnvironment = typeof jest !== 'undefined';

const IDLE_TIMEOUT_MS = 2_000;

type IdleScheduler = (callback: () => void, options?: { timeout?: number }) => number;

const runWhenIdle = (callback: () => void): void => {
  const requestIdle = (globalThis as typeof globalThis & { requestIdleCallback?: IdleScheduler }).requestIdleCallback;

  if (typeof requestIdle === 'function') {
    requestIdle(callback, { timeout: IDLE_TIMEOUT_MS });
    return;
  }

  setTimeout(callback, 0);
};

export const scheduleAfterInteractions = (callback: () => void): void => {
  if (isTestEnvironment) {
    callback();
    return;
  }

  runWhenIdle(callback);
};
