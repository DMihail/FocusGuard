/** @format */

import { Platform } from 'react-native';

import { BatteryOptimization, DisplayOverApps, NotificationsIcon, UsageAccess } from '@/assets/svg/EnablePermissions';

import type { PermissionId, PermissionItem } from '../types';

const ANDROID_PERMISSION_IDS: PermissionId[] = [
  'usage-access',
  'display-over-apps',
  'battery-optimization',
  'notifications',
];

const IOS_PERMISSION_IDS: PermissionId[] = ['usage-access', 'notifications'];

export const getPermissionIds = (): PermissionId[] =>
  Platform.OS === 'ios' ? IOS_PERMISSION_IDS : ANDROID_PERMISSION_IDS;

/** Platform-specific permission ids shown on Enable Permissions. */
export const PERMISSION_IDS: PermissionId[] = getPermissionIds();

const createAndroidPermissions = (appDisplayName: string): PermissionItem[] => [
  {
    id: 'usage-access',
    title: 'Usage Access',
    description: `Enable “Usage access” for ${appDisplayName}. On Xiaomi/Redmi: Settings → Privacy → Special permissions → Usage access, or use Grant to open app permissions.`,
    status: 'pending',
    Icon: UsageAccess,
  },
  {
    id: 'display-over-apps',
    title: 'Display Over Apps',
    description: 'Needed to show blocking overlays when limits are reached',
    status: 'pending',
    Icon: DisplayOverApps,
  },
  {
    id: 'battery-optimization',
    title: 'Run in Background',
    description: 'Disable battery limits so monitoring works after you leave the app or reboot',
    status: 'pending',
    Icon: BatteryOptimization,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Optional — send reminders and limit warnings. You can enable this later in Settings.',
    status: 'pending',
    Icon: NotificationsIcon,
  },
];

const createIosPermissions = (appDisplayName: string): PermissionItem[] => [
  {
    id: 'usage-access',
    title: 'Screen Time',
    description: `Allow ${appDisplayName} to manage your app limits with Screen Time.`,
    status: 'pending',
    Icon: UsageAccess,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Optional — send reminders and limit warnings. You can enable this later in Settings.',
    status: 'pending',
    Icon: NotificationsIcon,
  },
];

export const createPermissions = (appDisplayName: string): PermissionItem[] =>
  Platform.OS === 'ios' ? createIosPermissions(appDisplayName) : createAndroidPermissions(appDisplayName);
