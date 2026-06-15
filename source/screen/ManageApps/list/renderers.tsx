import React from 'react';

import { getManageAppKey } from '@/domain/appKey';
import type { ListRenderItem } from '@/list';

import type { CategoryFilterOption, ManageApp } from '../types';

import { CategoryFilterChip } from '../components/CategoryFilterChip';
import { ManageAppListItem } from '../components/ManageAppListItem';

export const createManageAppListRenderItem = (
  isSelected: (appKey: string) => boolean,
  onToggle: (app: ManageApp) => void,
): ListRenderItem<ManageApp> => {
  return ({ item }) => (
    <ManageAppListItem app={item} isSelected={isSelected(getManageAppKey(item))} onToggle={onToggle} />
  );
};

export const createCategoryFilterRenderItem = (
  activeCategoryId: string,
  onCategoryChange: (categoryId: string) => void,
): ListRenderItem<CategoryFilterOption> => {
  return ({ item }) => (
    <CategoryFilterChip category={item} isActive={activeCategoryId === item.id} onCategoryChange={onCategoryChange} />
  );
};
