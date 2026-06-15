/** @format */

import { NotificationsIcon, UsageAccess } from '@/assets/svg/EnablePermissions';
import { getPermissionIds } from '@/domain/permissions/permissionIds.ios';

import type { PermissionItem } from '../types';

export const createPermissions = (appDisplayName: string): PermissionItem[] => [
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

export { getPermissionIds };
