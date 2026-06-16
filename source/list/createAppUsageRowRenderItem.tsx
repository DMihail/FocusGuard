import React from 'react';

import { getManageAppKey } from '@/domain/appKey';
import { testIds } from '@/testing/testIds';
import type { DashboardAppRow } from '@/utils/usage/dashboardStats';

import type { ListRenderItem } from './types';

import { AppUsageRow } from '@/components';

export const createAppUsageRowRenderItem = (
  onPress: (appKey: string) => void,
  rowTestId: (appKey: string) => string = testIds.dashboard.appRow,
): ListRenderItem<DashboardAppRow> => {
  return ({ item }) => <AppUsageRow {...item} onPress={onPress} rowTestID={rowTestId(getManageAppKey(item))} />;
};
