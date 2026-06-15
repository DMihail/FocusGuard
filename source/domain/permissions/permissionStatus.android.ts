/** @format */

import { checkForManifestMonitorPermissions } from '@/specs';

import { permissionChecks, permissionRequests } from './permissionHandlers.android';
import { getPermissionIds } from './permissionIds.android';
import type { PermissionId, PermissionStatus } from './types';

const ANDROID_REQUIRED_PERMISSION_IDS: PermissionId[] = ['usage-access', 'display-over-apps', 'battery-optimization'];

/** Reads current native permission statuses for all Enable Permissions cards. */
export const readPermissionStatuses = (): Record<PermissionId, PermissionStatus> =>
  Object.fromEntries(getPermissionIds().map((id) => [id, permissionChecks[id]() ? 'granted' : 'pending'])) as Record<
    PermissionId,
    PermissionStatus
  >;

/** Returns `true` when required native permissions for Android are granted. */
export const areRequiredPermissionsGranted = (statuses: Record<PermissionId, PermissionStatus>): boolean =>
  ANDROID_REQUIRED_PERMISSION_IDS.every((id) => statuses[id] === 'granted') && checkForManifestMonitorPermissions();

/** Opens the system settings screen for a permission card action. */
export const requestPermissionById = (id: PermissionId): void => {
  permissionRequests[id]();
};
