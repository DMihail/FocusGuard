/** @format */

import { PERMISSIONS } from '../data/permissions';
import type { PermissionId, PermissionItem, PermissionStatus } from '../types';

export const buildPermissionsWithStatus = (statusById: Record<PermissionId, PermissionStatus>): PermissionItem[] =>
  PERMISSIONS.map((item) => ({
    ...item,
    status: statusById[item.id] ?? item.status,
  }));
