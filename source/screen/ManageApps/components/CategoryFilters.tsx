/** @format */

import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { testIds } from '@/testing/testIds';
import type { CategoryFilterOption } from '../types';
import { manageAppsStyles } from '../styles';

type CategoryFiltersProps = {
  filters: CategoryFilterOption[];
  activeCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
};

export const CategoryFilters = ({ filters, activeCategoryId, onCategoryChange }: CategoryFiltersProps) => (
  <View style={manageAppsStyles.filters}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={manageAppsStyles.filters}
      contentContainerStyle={manageAppsStyles.filtersContent}
      testID={testIds.manageApps.categoryFilters}
    >
      {filters.map((category) => {
        const isActive = activeCategoryId === category.id;

        return (
          <Pressable
            key={category.id}
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
      })}
    </ScrollView>
  </View>
);
