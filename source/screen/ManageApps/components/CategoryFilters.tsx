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

const CategoryFilterChip = memo(function CategoryFilterChipView({
  category,
  isActive,
  onCategoryChange,
}: CategoryFilterChipProps) {
  const handlePress = useCallback(() => {
    onCategoryChange(category.id);
  }, [category.id, onCategoryChange]);

  return (
    <Pressable
      testID={testIds.manageApps.categoryFilter(category.id)}
      accessibilityRole="button"
      accessibilityLabel={`Category filter ${category.label}`}
      accessibilityState={{ selected: isActive }}
      style={[manageAppsStyles.filterChip, isActive && manageAppsStyles.filterChipActive]}
      onPress={handlePress}
    >
      <Text style={[manageAppsStyles.filterChipText, isActive && manageAppsStyles.filterChipTextActive]}>
        {category.label}
      </Text>
    </Pressable>
  );
});

export const CategoryFilters = ({ filters, activeCategoryId, onCategoryChange }: CategoryFiltersProps) => {
  const renderItem: ListRenderItem<CategoryFilterOption> = useCallback(
    ({ item }) => (
      <CategoryFilterChip category={item} isActive={activeCategoryId === item.id} onCategoryChange={onCategoryChange} />
    ),
    [activeCategoryId, onCategoryChange],
  );

  const keyExtractor = useCallback((item: CategoryFilterOption) => item.id, []);

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
      extraData={activeCategoryId}
      {...CHIP_ROW_FLAT_LIST_PROPS}
    />
  );
};
