/** @format */

import React from 'react';

import type { ListRenderItem } from '@/list';
import type { DashboardAppRow } from '@/utils/usage/dashboardStats';

import { DistractingAppRow } from '../components/DistractingAppRow';

export const createDistractingAppRenderItem = (
  onPress: (packageName: string) => void,
): ListRenderItem<DashboardAppRow> => {
  return ({ item }) => <DistractingAppRow {...item} onPress={onPress} />;
};
