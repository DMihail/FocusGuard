/** @format */

import { checkForManifestMonitorPermissions, checkForPermission, checkForSystemAlertWindowPermission } from '@/specs';

/** All permissions required before Focus Mode can run the monitor service. */
export const canStartMonitoring = (): boolean =>
  checkForPermission() && checkForSystemAlertWindowPermission() && checkForManifestMonitorPermissions();
