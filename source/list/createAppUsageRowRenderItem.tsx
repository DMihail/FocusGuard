/** @format */

import React from 'react';

import { testIds } from '@/testing/testIds';
import type { DashboardAppRow } from '@/utils/usage/dashboardStats';

import type { ListRenderItem } from './types';

import { AppUsageRow } from '@/components';

export const createAppUsageRowRenderItem = (
  onPress: (packageName: string) => void,
  rowTestId: (packageName: string) => string = testIds.dashboard.appRow,
): ListRenderItem<DashboardAppRow> => {
  return ({ item }) => <AppUsageRow {...item} onPress={onPress} rowTestID={rowTestId(item.packageName)} />;
};
