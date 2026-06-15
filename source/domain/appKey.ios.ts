/** @format */

import type { ManageApp } from '@/domain/types';

/** Stable app identifier on iOS — opaque Screen Time token id. */
export const getManageAppKey = (app: ManageApp): string => app.tokenId ?? app.packageName;
