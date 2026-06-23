/** @format */

import { BatteryOptimization, DisplayOverApps, NotificationsIcon, UsageAccess } from '@/assets/svg/EnablePermissions';
import { getPermissionIds } from '@/domain/permissions/permissionIds.android';
import type { TranslateFn } from '@/i18n';

import type { PermissionItem } from '../types';

export const createPermissions = (appName: string, t: TranslateFn): PermissionItem[] => [
  {
    id: 'usage-access',
    title: t('permissions.android.usageAccess.title'),
    description: t('permissions.android.usageAccess.description', { appName }),
    status: 'pending',
    Icon: UsageAccess,
  },
  {
    id: 'display-over-apps',
    title: t('permissions.android.displayOverApps.title'),
    description: t('permissions.android.displayOverApps.description'),
    status: 'pending',
    Icon: DisplayOverApps,
  },
  {
    id: 'battery-optimization',
    title: t('permissions.android.batteryOptimization.title'),
    description: t('permissions.android.batteryOptimization.description'),
    status: 'pending',
    Icon: BatteryOptimization,
  },
  {
    id: 'notifications',
    title: t('permissions.android.notifications.title'),
    description: t('permissions.android.notifications.description'),
    status: 'pending',
    Icon: NotificationsIcon,
  },
];

export { getPermissionIds };
