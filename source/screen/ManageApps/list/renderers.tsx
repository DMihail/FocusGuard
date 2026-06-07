/** @format */

import React from 'react';

import type { ListRenderItem as FlashListRenderItem } from '@shopify/flash-list';

import type { ListRenderItem } from '@/list';

import type { CategoryFilterOption, ManageApp } from '../types';

import { CategoryFilterChip } from '../components/CategoryFilterChip';
import { ManageAppListItem } from '../components/ManageAppListItem';

export const createManageAppListRenderItem = (
  isSelected: (packageName: string) => boolean,
  onToggle: (app: ManageApp) => void,
): FlashListRenderItem<ManageApp> => {
  return ({ item }) => <ManageAppListItem app={item} isSelected={isSelected(item.packageName)} onToggle={onToggle} />;
};

export const createCategoryFilterRenderItem = (
  activeCategoryId: string,
  onCategoryChange: (categoryId: string) => void,
): ListRenderItem<CategoryFilterOption> => {
  return ({ item }) => (
    <CategoryFilterChip category={item} isActive={activeCategoryId === item.id} onCategoryChange={onCategoryChange} />
  );
};
