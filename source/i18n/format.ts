/** @format */

import type { TranslateFn } from './types';

export const createDurationFormatter = (t: TranslateFn) => {
  return (minutes: number): string => {
    const normalizedMinutes = Math.max(0, Math.round(minutes));

    if (normalizedMinutes < 60) {
      return t('format.minutesShort', { minutes: normalizedMinutes });
    }

    const hours = Math.floor(normalizedMinutes / 60);
    const remainder = normalizedMinutes % 60;

    return remainder > 0
      ? t('format.hoursMinutesShort', { hours, minutes: remainder })
      : t('format.hoursShort', { hours });
  };
};

export const formatAppsMonitored = (t: TranslateFn, count: number): string => t('format.appsMonitored', { count });
