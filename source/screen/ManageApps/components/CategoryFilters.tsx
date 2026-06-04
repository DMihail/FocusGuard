/** @format */

import React from 'react';
import { FlatList, Pressable, Text } from 'react-native';

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

const CategoryFilterChip = ({ category, isActive, onCategoryChange }: CategoryFilterChipProps) => (
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
);

export const CategoryFilters = ({ filters, activeCategoryId, onCategoryChange }: CategoryFiltersProps) => (
  <FlatList
    horizontal
    data={filters}
    renderItem={({ item }) => (
      <CategoryFilterChip category={item} isActive={activeCategoryId === item.id} onCategoryChange={onCategoryChange} />
    )}
    keyExtractor={(item) => item.id}
    showsHorizontalScrollIndicator={false}
    style={manageAppsStyles.filters}
    contentContainerStyle={manageAppsStyles.filtersContent}
    testID={testIds.manageApps.categoryFilters}
    accessibilityRole="list"
    accessibilityLabel="App category filters"
    {...CHIP_ROW_FLAT_LIST_PROPS}
  />
);
