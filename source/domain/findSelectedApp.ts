import type { ManageApp } from '@/domain/types';

import { getManageAppKey } from './appKey';

export const findSelectedApp = (apps: ManageApp[], appKey: string): ManageApp | undefined =>
  apps.find((app) => getManageAppKey(app) === appKey);
