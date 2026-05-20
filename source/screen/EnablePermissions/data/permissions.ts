/** @format */

import { DisplayOverApps, NotificationsIcon, UsageAccess } from '../../../assets/svg/EnablePermissions';
import type { PermissionItem } from '../types';

export const PERMISSIONS: PermissionItem[] = [
  {
    id: 'usage-access',
    title: 'Usage Access',
    description: 'Required to track app usage and enforce limits',
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
    id: 'notifications',
    title: 'Notifications',
    description: 'Send reminders and limit warnings',
    status: 'pending',
    Icon: NotificationsIcon,
  },
];
