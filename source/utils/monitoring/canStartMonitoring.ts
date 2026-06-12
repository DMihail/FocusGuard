/** @format */

import { areAllPermissionsGranted } from '@/domain/permissionSnapshot';

/** All permissions required before Focus Mode can run the monitor service. */
export const canStartMonitoring = (): boolean => areAllPermissionsGranted();
