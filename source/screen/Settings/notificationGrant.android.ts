/** @format */

import { checkForNotificationsPermission } from '@/specs';

export const readSystemNotificationsGranted = (): boolean => checkForNotificationsPermission();

export const isSystemNotificationGrantRequired = true;
