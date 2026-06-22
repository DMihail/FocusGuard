/** @format */

import React, { memo } from 'react';
import { Pressable, Text } from 'react-native';

import { testIds } from '@/testing/testIds';

import { useManageAppsStyles } from '../styles';
import type { CategoryFilterOption } from '../types';

export type CategoryFilterChipProps = {
  category: CategoryFilterOption;
  isActive: boolean;
  onCategoryChange: (categoryId: string) => void;
};

const areCategoryFilterChipPropsEqual = (previous: CategoryFilterChipProps, next: CategoryFilterChipProps): boolean =>
  previous.category.id === next.category.id &&
  previous.category.label === next.category.label &&
  previous.isActive === next.isActive &&
  previous.onCategoryChange === next.onCategoryChange;

export const CategoryFilterChip = memo(({ category, isActive, onCategoryChange }: CategoryFilterChipProps) => {
  const styles = useManageAppsStyles();

  return (
    <Pressable
      testID={testIds.manageApps.categoryFilter(category.id)}
      accessibilityRole="button"
      accessibilityLabel={`Category filter ${category.label}`}
      accessibilityState={{ selected: isActive }}
      style={[styles.filterChip, isActive && styles.filterChipActive]}
      onPress={() => onCategoryChange(category.id)}
    >
      <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{category.label}</Text>
    </Pressable>
  );
}, areCategoryFilterChipPropsEqual);
