/** @format */

import { Platform } from 'react-native';

import {
  checkForIgnoreBatteryOptimizationsPermission,
  checkForManifestMonitorPermissions,
  checkForNotificationsPermission,
  checkForPermission,
  checkForSystemAlertWindowPermission,
  requestIgnoreBatteryOptimizationsPermission,
  requestNotificationsPermission,
  requestSystemAlertWindowPermission,
  requestUsageStatsPermission,
} from '@/specs';

import { getPermissionIds } from '../data/permissions';
import type { PermissionId, PermissionStatus } from '../types';

const ANDROID_REQUIRED_PERMISSION_IDS: PermissionId[] = ['usage-access', 'display-over-apps', 'battery-optimization'];
const IOS_REQUIRED_PERMISSION_IDS: PermissionId[] = ['usage-access'];

const permissionChecks: Record<PermissionId, () => boolean> = {
  'usage-access': checkForPermission,
  'display-over-apps': checkForSystemAlertWindowPermission,
  notifications: checkForNotificationsPermission,
  'battery-optimization': checkForIgnoreBatteryOptimizationsPermission,
};

const permissionRequests: Record<PermissionId, () => void> = {
  'usage-access': requestUsageStatsPermission,
  'display-over-apps': requestSystemAlertWindowPermission,
  notifications: requestNotificationsPermission,
  'battery-optimization': requestIgnoreBatteryOptimizationsPermission,
};

const readIosPermissionStatuses = (): Record<PermissionId, PermissionStatus> => {
  const visibleStatuses = Object.fromEntries(
    getPermissionIds().map((id) => [id, permissionChecks[id]() ? 'granted' : 'pending']),
  ) as Record<PermissionId, PermissionStatus>;

  return {
    ...visibleStatuses,
    'display-over-apps': 'granted',
    'battery-optimization': 'granted',
  };
};

/** Reads current native permission statuses for all Enable Permissions cards. */
export const readPermissionStatuses = (): Record<PermissionId, PermissionStatus> => {
  if (Platform.OS === 'ios') {
    return readIosPermissionStatuses();
  }

  return Object.fromEntries(
    getPermissionIds().map((id) => [id, permissionChecks[id]() ? 'granted' : 'pending']),
  ) as Record<PermissionId, PermissionStatus>;
};

/** Returns `true` when required native permissions for the current platform are granted. */
export const areRequiredPermissionsGranted = (statuses: Record<PermissionId, PermissionStatus>): boolean => {
  if (Platform.OS === 'ios') {
    return IOS_REQUIRED_PERMISSION_IDS.every((id) => statuses[id] === 'granted');
  }

  return (
    ANDROID_REQUIRED_PERMISSION_IDS.every((id) => statuses[id] === 'granted') && checkForManifestMonitorPermissions()
  );
};

/** Opens the system settings screen for a permission card action. */
export const requestPermissionById = (id: PermissionId): void => {
  if (Platform.OS === 'ios') {
    if (getPermissionIds().includes(id)) {
      permissionRequests[id]();
    }

    return;
  }

  permissionRequests[id]();
};
