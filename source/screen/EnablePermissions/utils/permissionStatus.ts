/** @format */

import { Platform } from 'react-native';
import {
  checkForNotificationsPermission,
  checkForPermission,
  checkForSystemAlertWindowPermission,
  requestNotificationsPermission,
  requestSystemAlertWindowPermission,
  requestUsageStatsPermission,
} from '@/specs';
import { PERMISSIONS } from '../data/permissions';
import type { PermissionId, PermissionStatus } from '../types';

const permissionChecks: Record<PermissionId, () => boolean> = {
  'usage-access': checkForPermission,
  'display-over-apps': checkForSystemAlertWindowPermission,
  'notifications': checkForNotificationsPermission,
};

const permissionRequests: Record<PermissionId, () => void> = {
  'usage-access': requestUsageStatsPermission,
  'display-over-apps': requestSystemAlertWindowPermission,
  'notifications': requestNotificationsPermission,
};

export const readPermissionStatuses = (): Record<PermissionId, PermissionStatus> => {
  if (Platform.OS !== 'android') {
    return Object.fromEntries(PERMISSIONS.map((item) => [item.id, 'granted'])) as Record<
      PermissionId,
      PermissionStatus
    >;
  }

  return Object.fromEntries(
    PERMISSIONS.map((item) => [item.id, permissionChecks[item.id]() ? 'granted' : 'pending']),
  ) as Record<PermissionId, PermissionStatus>;
};

export const areAllPermissionsGranted = (): boolean => {
  const statuses = readPermissionStatuses();
  return PERMISSIONS.every((item) => statuses[item.id] === 'granted');
};

export const requestPermissionById = (id: PermissionId): void => {
  if (Platform.OS !== 'android') {
    return;
  }

  permissionRequests[id]();
};
