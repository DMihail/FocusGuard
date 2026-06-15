/** @format */

import type { PermissionId, PermissionStatus } from '@/domain/permissions';

import type { PermissionItem } from '../types';

/** Merges static permission metadata with live native status values. */
export const buildPermissionsWithStatus = (
  permissionItems: PermissionItem[],
  statusById: Record<PermissionId, PermissionStatus>,
): PermissionItem[] =>
  permissionItems.map((item) => ({
    ...item,
    status: statusById[item.id] ?? item.status,
  }));
