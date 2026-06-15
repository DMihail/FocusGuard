import type { ManageApp } from '@/domain/types';

export const getManageAppKey = (app: ManageApp): string => app.tokenId ?? app.packageName;
