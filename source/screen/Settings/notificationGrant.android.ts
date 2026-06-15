/** @format */

import { checkForNotificationsPermission } from '@/specs/nativeUsageStatsApi.android';

export const readSystemNotificationsGranted = (): boolean => checkForNotificationsPermission();

export const isSystemNotificationGrantRequired = true;
