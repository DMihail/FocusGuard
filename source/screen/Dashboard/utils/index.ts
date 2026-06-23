/** @format */

import type { TranslateFn } from '@/i18n';

export const getGreeting = (t: TranslateFn, date = new Date()): string => {
  const hour = date.getHours();

  if (hour < 12) {
    return t('dashboard.greeting.morning');
  }

  if (hour < 18) {
    return t('dashboard.greeting.afternoon');
  }

  return t('dashboard.greeting.evening');
};
