/** @format */

import {
  checkForIgnoreBatteryOptimizationsPermission,
  checkForNotificationsPermission,
  checkForPermission,
  checkForSystemAlertWindowPermission,
  requestIgnoreBatteryOptimizationsPermission,
  requestNotificationsPermission,
  requestSystemAlertWindowPermission,
  requestUsageStatsPermission,
} from '@/specs';

import type { PermissionId } from './types';

export const permissionChecks: Record<PermissionId, () => boolean> = {
  'usage-access': checkForPermission,
  'display-over-apps': checkForSystemAlertWindowPermission,
  notifications: checkForNotificationsPermission,
  'battery-optimization': checkForIgnoreBatteryOptimizationsPermission,
};

export const permissionRequests: Record<PermissionId, () => void> = {
  'usage-access': requestUsageStatsPermission,
  'display-over-apps': requestSystemAlertWindowPermission,
  notifications: requestNotificationsPermission,
  'battery-optimization': requestIgnoreBatteryOptimizationsPermission,
};
