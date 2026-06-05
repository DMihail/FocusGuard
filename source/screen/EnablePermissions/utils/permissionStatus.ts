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

import { PERMISSION_IDS } from '../data/permissions';
import type { PermissionId, PermissionStatus } from '../types';

/** Required to continue; notifications can be granted later from this screen or Settings. */
const REQUIRED_PERMISSION_IDS: PermissionId[] = ['usage-access', 'display-over-apps', 'battery-optimization'];

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

export const readPermissionStatuses = (): Record<PermissionId, PermissionStatus> => {
  if (Platform.OS !== 'android') {
    return Object.fromEntries(PERMISSION_IDS.map((id) => [id, 'granted'])) as Record<PermissionId, PermissionStatus>;
  }

  return Object.fromEntries(PERMISSION_IDS.map((id) => [id, permissionChecks[id]() ? 'granted' : 'pending'])) as Record<
    PermissionId,
    PermissionStatus
  >;
};

export const areRequiredPermissionsGranted = (statuses: Record<PermissionId, PermissionStatus>): boolean => {
  if (Platform.OS !== 'android') {
    return true;
  }

  return REQUIRED_PERMISSION_IDS.every((id) => statuses[id] === 'granted') && checkForManifestMonitorPermissions();
};

export const areAllPermissionsGranted = (): boolean => areRequiredPermissionsGranted(readPermissionStatuses());

export const requestPermissionById = (id: PermissionId): void => {
  if (Platform.OS !== 'android') {
    return;
  }

  permissionRequests[id]();
};
