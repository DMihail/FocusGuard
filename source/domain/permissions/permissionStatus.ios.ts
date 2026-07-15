/** @format */

import type { IosPermissionId } from './permissionHandlers.ios';
import { permissionChecks, permissionRequests } from './permissionHandlers.ios';
import { getPermissionIds } from './permissionIds.ios';
import type { PermissionId, PermissionStatus } from './types';

const IOS_REQUIRED_PERMISSION_IDS: PermissionId[] = ['usage-access'];

/** Reads current native permission statuses for all Enable Permissions cards. */
export const readPermissionStatuses = (): Record<PermissionId, PermissionStatus> => {
  const visibleStatuses = Object.fromEntries(
    getPermissionIds().map((id) => [id, permissionChecks[id as IosPermissionId]() ? 'granted' : 'pending']),
  ) as Record<PermissionId, PermissionStatus>;

  return {
    ...visibleStatuses,
    'display-over-apps': 'granted',
    'battery-optimization': 'granted',
    'accessibility-service': 'granted',
  };
};

/** Returns `true` when required native permissions for iOS are granted. */
export const areRequiredPermissionsGranted = (statuses: Record<PermissionId, PermissionStatus>): boolean =>
  IOS_REQUIRED_PERMISSION_IDS.every((id) => statuses[id] === 'granted');

/** Opens the system settings screen for a permission card action. */
export const requestPermissionById = (id: PermissionId): void => {
  if (getPermissionIds().includes(id)) {
    permissionRequests[id as IosPermissionId]();
  }
};
