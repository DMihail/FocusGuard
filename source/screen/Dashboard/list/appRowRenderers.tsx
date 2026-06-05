/** @format */

import React from 'react';

import type { ListRenderItem } from '@/list';
import type { DashboardAppRow } from '@/utils/usage/dashboardStats';

import { AppUsageRow } from '@/components';

export const createDashboardAppRowRenderItem = (
  onPress: (packageName: string) => void,
): ListRenderItem<DashboardAppRow> => {
  return ({ item }) => <AppUsageRow {...item} onPress={onPress} />;
};
