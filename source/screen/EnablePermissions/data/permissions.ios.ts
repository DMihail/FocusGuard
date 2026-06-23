/** @format */

import { NotificationsIcon, UsageAccess } from '@/assets/svg/EnablePermissions';
import { getPermissionIds } from '@/domain/permissions/permissionIds.ios';
import type { TranslateFn } from '@/i18n';

import type { PermissionItem } from '../types';

export const createPermissions = (appName: string, t: TranslateFn): PermissionItem[] => [
  {
    id: 'usage-access',
    title: t('permissions.ios.screenTime.title'),
    description: t('permissions.ios.screenTime.description', { appName }),
    status: 'pending',
    Icon: UsageAccess,
  },
  {
    id: 'notifications',
    title: t('permissions.ios.notifications.title'),
    description: t('permissions.ios.notifications.description'),
    status: 'pending',
    Icon: NotificationsIcon,
  },
];

export { getPermissionIds };
