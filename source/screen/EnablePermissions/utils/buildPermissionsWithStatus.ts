/** @format */

import type { PermissionId, PermissionItem, PermissionStatus } from '../types';

export const buildPermissionsWithStatus = (
  permissionItems: PermissionItem[],
  statusById: Record<PermissionId, PermissionStatus>,
): PermissionItem[] =>
  permissionItems.map((item) => ({
    ...item,
    status: statusById[item.id] ?? item.status,
  }));
