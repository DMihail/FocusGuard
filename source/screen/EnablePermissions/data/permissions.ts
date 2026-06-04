/** @format */

import { BatteryOptimization, DisplayOverApps, NotificationsIcon, UsageAccess } from '@/assets/svg/EnablePermissions';

import type { PermissionItem } from '../types';

export const PERMISSIONS: PermissionItem[] = [
  {
    id: 'usage-access',
    title: 'Usage Access',
    description:
      'Enable “Usage access” for FocusGuard. On Xiaomi/Redmi: Settings → Privacy → Special permissions → Usage access, or use Grant to open app permissions.',
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
