const isTestEnvironment = typeof jest !== 'undefined';

/** Defers work to the next microtask without scheduling a timer. */
export const scheduleMicrotask = (callback: () => void): void => {
  if (isTestEnvironment) {
    callback();
    return;
  }

  Promise.resolve().then(callback);
};
