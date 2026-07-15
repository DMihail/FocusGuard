/** @format */

import {
  checkForAccessibilityServicePermission,
  checkForIgnoreBatteryOptimizationsPermission,
  checkForNotificationsPermission,
  checkForPermission,
  checkForSystemAlertWindowPermission,
  requestAccessibilityServicePermission,
  requestIgnoreBatteryOptimizationsPermission,
  requestNotificationsPermission,
  requestSystemAlertWindowPermission,
  requestUsageStatsPermission,
} from '@/specs/keeptTurboModuleApi.android';

import type { PermissionId } from './types';

export const permissionChecks: Record<PermissionId, () => boolean> = {
  'usage-access': checkForPermission,
  'display-over-apps': checkForSystemAlertWindowPermission,
  notifications: checkForNotificationsPermission,
  'battery-optimization': checkForIgnoreBatteryOptimizationsPermission,
  'accessibility-service': checkForAccessibilityServicePermission,
};

export const permissionRequests: Record<PermissionId, () => void> = {
  'usage-access': requestUsageStatsPermission,
  'display-over-apps': requestSystemAlertWindowPermission,
  notifications: requestNotificationsPermission,
  'battery-optimization': requestIgnoreBatteryOptimizationsPermission,
  'accessibility-service': requestAccessibilityServicePermission,
};
