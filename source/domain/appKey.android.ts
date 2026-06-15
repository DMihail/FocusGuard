/** @format */

import type { ManageApp } from '@/domain/types';

/** Stable app identifier on Android — the install package name. */
export const getManageAppKey = (app: ManageApp): string => app.packageName;
