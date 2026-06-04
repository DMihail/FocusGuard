/** @format */

import React from 'react';

import type { ListRenderItem } from '@/list';
import type { ManageApp } from '@/screen/ManageApps/types';

import { DistractingAppRow } from '../components/DistractingAppRow';

export const createDistractingAppRenderItem = (onPress: (packageName: string) => void): ListRenderItem<ManageApp> => {
  return ({ item }) => <DistractingAppRow {...item} onPress={onPress} />;
};
