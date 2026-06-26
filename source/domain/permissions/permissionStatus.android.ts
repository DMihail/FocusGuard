/** @format */

import { checkForManifestMonitorPermissions, checkForPermission } from '@/specs/nativeUsageStatsApi.android';
import { storage } from '@/store/mmkv';
import { USAGE_ACCESS_GRANTED_KEY } from '@/store/persistSchema';

import { permissionChecks, permissionRequests } from './permissionHandlers.android';
import { getPermissionIds } from './permissionIds.android';
import type { PermissionId, PermissionStatus } from './types';

const ANDROID_REQUIRED_PERMISSION_IDS: PermissionId[] = ['usage-access', 'display-over-apps'];

let usageAccessSessionLatch = false;

const pinUsageAccessSessionLatch = (): void => {
  usageAccessSessionLatch = true;
};

const clearUsageAccessSessionLatch = (): void => {
  usageAccessSessionLatch = false;
};

const readPersistedUsageAccessGrant = (): boolean => storage.getBoolean(USAGE_ACCESS_GRANTED_KEY) === true;

const persistUsageAccessGrant = (): void => {
  storage.set(USAGE_ACCESS_GRANTED_KEY, true);
};

const clearPersistedUsageAccessGrant = (): void => {
  storage.remove(USAGE_ACCESS_GRANTED_KEY);
};

const readNativePermissionStatuses = (): Record<PermissionId, PermissionStatus> =>
  Object.fromEntries(getPermissionIds().map((id) => [id, permissionChecks[id]() ? 'granted' : 'pending'])) as Record<
    PermissionId,
    PermissionStatus
  >;

const pinUsageAccessGrantIfDetected = (): void => {
  const wasGranted = checkForPermission() || readPersistedUsageAccessGrant();

  if (!wasGranted) {
    return;
  }

  pinUsageAccessSessionLatch();

  if (checkForPermission()) {
    persistUsageAccessGrant();
  }
};

const shouldLatchUsageAccess = (): boolean => usageAccessSessionLatch || readPersistedUsageAccessGrant();

/** Reads current native permission statuses for all Enable Permissions cards. */
export const readPermissionStatuses = (): Record<PermissionId, PermissionStatus> => {
  const statuses = readNativePermissionStatuses();

  if (statuses['usage-access'] === 'granted') {
    persistUsageAccessGrant();
    clearUsageAccessSessionLatch();
    return statuses;
  }

  if (shouldLatchUsageAccess()) {
    return { ...statuses, 'usage-access': 'granted' };
  }

  clearUsageAccessSessionLatch();
  return statuses;
};

/** Returns `true` when required native permissions for Android are granted. */
export const areRequiredPermissionsGranted = (statuses: Record<PermissionId, PermissionStatus>): boolean =>
  ANDROID_REQUIRED_PERMISSION_IDS.every((id) => statuses[id] === 'granted') && checkForManifestMonitorPermissions();

/** Opens the system settings screen for a permission card action. */
export const requestPermissionById = (id: PermissionId): void => {
  if (id === 'usage-access') {
    clearUsageAccessSessionLatch();
    clearPersistedUsageAccessGrant();
  } else {
    pinUsageAccessGrantIfDetected();
  }

  permissionRequests[id]();
};

/** @internal Resets Usage Access UI latches (tests only). */
export const resetUsageAccessUiLatchForTests = (): void => {
  clearUsageAccessSessionLatch();
  clearPersistedUsageAccessGrant();
};
