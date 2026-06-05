/** @format */

import type { PermissionId, PermissionItem, PermissionStatus } from '../types';

/** Merges static permission metadata with live native status values. */
export const buildPermissionsWithStatus = (
  permissionItems: PermissionItem[],
  statusById: Record<PermissionId, PermissionStatus>,
): PermissionItem[] =>
  permissionItems.map((item) => ({
    ...item,
    status: statusById[item.id] ?? item.status,
  }));
