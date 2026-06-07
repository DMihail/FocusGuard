/** @format */

import { InteractionManager } from 'react-native';

const isTestEnvironment = typeof jest !== 'undefined';

/** Defers work until navigation transitions and interactions finish. */
export const scheduleAfterInteractions = (callback: () => void): void => {
  if (isTestEnvironment) {
    callback();
    return;
  }

  InteractionManager.runAfterInteractions(callback);
};
