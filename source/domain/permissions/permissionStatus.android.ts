/** @format */

import { checkForManifestMonitorPermissions, checkForPermission } from '@/specs/nativeUsageStatsApi.android';
import { storage } from '@/store/mmkv';
import { USAGE_ACCESS_GRANTED_KEY } from '@/store/persistSchema';

import { permissionChecks, permissionRequests } from './permissionHandlers.android';
import { getPermissionIds } from './permissionIds.android';
import type { PermissionId, PermissionStatus } from './types';

const ANDROID_REQUIRED_PERMISSION_IDS: PermissionId[] = ['usage-access', 'display-over-apps', 'battery-optimization'];

let usageAccessSessionLatch = false;

const isUsageAccessLatched = (): boolean =>
  usageAccessSessionLatch || (storage.getBoolean(USAGE_ACCESS_GRANTED_KEY) ?? false);

const setUsageAccessLatched = (latched: boolean): void => {
  usageAccessSessionLatch = latched;

  if (latched) {
    storage.set(USAGE_ACCESS_GRANTED_KEY, true);
    return;
  }

  storage.remove(USAGE_ACCESS_GRANTED_KEY);
};

const readNativePermissionStatuses = (): Record<PermissionId, PermissionStatus> =>
  Object.fromEntries(getPermissionIds().map((id) => [id, permissionChecks[id]() ? 'granted' : 'pending'])) as Record<
    PermissionId,
    PermissionStatus
  >;

const pinUsageAccessGrantIfDetected = (): void => {
  if (checkForPermission()) {
    setUsageAccessLatched(true);
  }
};

/** Reads current native permission statuses for all Enable Permissions cards. */
export const readPermissionStatuses = (): Record<PermissionId, PermissionStatus> => {
  const statuses = readNativePermissionStatuses();

  if (statuses['usage-access'] === 'granted') {
    setUsageAccessLatched(true);
    return statuses;
  }

  if (isUsageAccessLatched()) {
    return { ...statuses, 'usage-access': 'granted' };
  }

  return statuses;
};

/** Returns `true` when required native permissions for Android are granted. */
export const areRequiredPermissionsGranted = (statuses: Record<PermissionId, PermissionStatus>): boolean =>
  ANDROID_REQUIRED_PERMISSION_IDS.every((id) => statuses[id] === 'granted') && checkForManifestMonitorPermissions();

/** Opens the system settings screen for a permission card action. */
export const requestPermissionById = (id: PermissionId): void => {
  if (id === 'usage-access') {
    setUsageAccessLatched(false);
  } else {
    pinUsageAccessGrantIfDetected();
  }

  permissionRequests[id]();
};

/** @internal Resets Usage Access UI latches (tests only). */
export const resetUsageAccessUiLatchForTests = (): void => {
  setUsageAccessLatched(false);
};
