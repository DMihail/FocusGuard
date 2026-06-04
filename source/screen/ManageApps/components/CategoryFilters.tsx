/** @format */

import React, { useMemo } from 'react';
import { FlatList } from 'react-native';

import { CHIP_ROW_FLAT_LIST_PROPS } from '@/list';
import { testIds } from '@/testing/testIds';

import { categoryFilterKeyExtractor, createCategoryFilterRenderItem } from '../list';
import { manageAppsStyles } from '../styles';
import type { CategoryFilterOption } from '../types';

type CategoryFiltersProps = {
  filters: CategoryFilterOption[];
  activeCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
};

export const CategoryFilters = ({ filters, activeCategoryId, onCategoryChange }: CategoryFiltersProps) => {
  const renderItem = useMemo(
    () => createCategoryFilterRenderItem(activeCategoryId, onCategoryChange),
    [activeCategoryId, onCategoryChange],
  );

  return (
    <FlatList
      horizontal
      data={filters}
      renderItem={renderItem}
      keyExtractor={categoryFilterKeyExtractor}
      showsHorizontalScrollIndicator={false}
      style={manageAppsStyles.filters}
      contentContainerStyle={manageAppsStyles.filtersContent}
      testID={testIds.manageApps.categoryFilters}
      accessibilityRole="list"
      accessibilityLabel="App category filters"
      extraData={activeCategoryId}
      {...CHIP_ROW_FLAT_LIST_PROPS}
    />
  );
};
