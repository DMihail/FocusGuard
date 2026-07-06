/** @format */

import { checkForNotificationsPermission } from '@/specs/keeptTurboModuleApi.android';

export const readSystemNotificationsGranted = (): boolean => checkForNotificationsPermission();

export const isSystemNotificationGrantRequired = true;
