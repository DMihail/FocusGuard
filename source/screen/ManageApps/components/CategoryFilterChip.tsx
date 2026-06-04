/** @format */

import React, { memo } from 'react';
import { Pressable, Text } from 'react-native';

import { testIds } from '@/testing/testIds';

import { manageAppsStyles } from '../styles';
import type { CategoryFilterOption } from '../types';

export type CategoryFilterChipProps = {
  category: CategoryFilterOption;
  isActive: boolean;
  onCategoryChange: (categoryId: string) => void;
};

function CategoryFilterChipView({ category, isActive, onCategoryChange }: CategoryFilterChipProps) {
  return (
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
}

export const CategoryFilterChip = memo(CategoryFilterChipView);
