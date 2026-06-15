/** @format */

import {
  checkForNotificationsPermission,
  checkForPermission,
  requestNotificationsPermission,
  requestUsageStatsPermission,
} from '@/specs/nativeUsageStatsApi.ios';

import type { PermissionId } from './types';

export type IosPermissionId = Extract<PermissionId, 'usage-access' | 'notifications'>;

export const permissionChecks: Record<IosPermissionId, () => boolean> = {
  'usage-access': checkForPermission,
  notifications: checkForNotificationsPermission,
};

export const permissionRequests: Record<IosPermissionId, () => void> = {
  'usage-access': requestUsageStatsPermission,
  notifications: requestNotificationsPermission,
};
