/** @format */

import type { PermissionId } from './types';

const IOS_PERMISSION_IDS: PermissionId[] = ['usage-access', 'notifications'];

/** iOS permission cards shown on Enable Permissions. */
export const getPermissionIds = (): PermissionId[] => IOS_PERMISSION_IDS;
