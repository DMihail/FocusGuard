/** @format */

import React, { memo, useCallback } from 'react';
import { FlatList, type ListRenderItem, Pressable, Text } from 'react-native';

import { testIds } from '@/testing/testIds';
import { CHIP_ROW_FLAT_LIST_PROPS } from '@/utils/flatListDefaults';

import { manageAppsStyles } from '../styles';
import type { CategoryFilterOption } from '../types';

type CategoryFiltersProps = {
  filters: CategoryFilterOption[];
  activeCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
};

type CategoryFilterChipProps = {
  category: CategoryFilterOption;
  isActive: boolean;
  onCategoryChange: (categoryId: string) => void;
};

const CategoryFilterChip = memo(({ category, isActive, onCategoryChange }: CategoryFilterChipProps) => (
  <Pressable
    testID={testIds.manageApps.categoryFilter(category.id)}
    accessibilityRole="button"
    accessibilityLabel={`Category filter ${category.label}`}
    accessibilityState={{ selected: isActive }}
    style={[manageAppsStyles.filterChip, isActive && manageAppsStyles.filterChipActive]}
    onPress={() => onCategoryChange(category.id)}
  >
    <Text style={[manageAppsStyles.filterChipText, isActive && manageAppsStyles.filterChipTextActive]}>
      {category.label}
    </Text>
  </Pressable>
));

CategoryFilterChip.displayName = 'CategoryFilterChip';

export const CategoryFilters = memo(({ filters, activeCategoryId, onCategoryChange }: CategoryFiltersProps) => {
  const keyExtractor = useCallback((item: CategoryFilterOption) => item.id, []);

  const renderItem: ListRenderItem<CategoryFilterOption> = useCallback(
    ({ item }) => (
      <CategoryFilterChip category={item} isActive={activeCategoryId === item.id} onCategoryChange={onCategoryChange} />
    ),
    [activeCategoryId, onCategoryChange],
  );

  return (
    <FlatList
      horizontal
      data={filters}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsHorizontalScrollIndicator={false}
      style={manageAppsStyles.filters}
      contentContainerStyle={manageAppsStyles.filtersContent}
      testID={testIds.manageApps.categoryFilters}
      accessibilityRole="list"
      accessibilityLabel="App category filters"
      {...CHIP_ROW_FLAT_LIST_PROPS}
    />
  );
});

CategoryFilters.displayName = 'CategoryFilters';
