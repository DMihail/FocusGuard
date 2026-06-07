import type { PermissionId, PermissionStatus } from '@/screen/EnablePermissions/types';
import {
  areRequiredPermissionsGranted,
  readPermissionStatuses,
} from '@/screen/EnablePermissions/utils/permissionStatus';

let snapshot: Record<PermissionId, PermissionStatus> | null = null;

export const getPermissionStatuses = (force = false): Record<PermissionId, PermissionStatus> => {
  if (!force && snapshot) {
    return snapshot;
  }

  snapshot = readPermissionStatuses();
  return snapshot;
};

export const invalidatePermissionSnapshot = (): void => {
  snapshot = null;
};

export const areAllPermissionsGranted = (): boolean => areRequiredPermissionsGranted(getPermissionStatuses());
