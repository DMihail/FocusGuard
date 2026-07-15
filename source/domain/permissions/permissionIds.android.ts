/** @format */

import type { PermissionId } from './types';

const ANDROID_PERMISSION_IDS: PermissionId[] = [
  'usage-access',
  'display-over-apps',
  'battery-optimization',
  'notifications',
  'accessibility-service',
];

/** Android permission cards shown on Enable Permissions. */
export const getPermissionIds = (): PermissionId[] => ANDROID_PERMISSION_IDS;
