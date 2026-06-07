/** @format */

'use strict';

/**
 * Must load before any `react-native-reanimated` import so module-init warnings
 * respect this config (see getLoggerConfig in Reanimated).
 */
global.__reanimatedLoggerConfig = {
  level: 1,
  strict: false,
  logFunction: ({ level, message }) => {
    if (message.includes('Reduced motion setting is enabled on this device')) {
      return;
    }

    if (level === 2) {
      console.error(message);
    } else {
      console.warn(message);
    }
  },
};
