/** @format */

import React from 'react';

import type { DashboardAppRow } from '@/utils/usage/dashboardStats';

import type { ListRenderItem } from './types';

import { AppUsageRow } from '@/components';

export const createAppUsageRowRenderItem = (
  onPress: (packageName: string) => void,
): ListRenderItem<DashboardAppRow> => {
  return ({ item }) => <AppUsageRow {...item} onPress={onPress} />;
};
