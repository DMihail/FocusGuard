/** @format */

import React, { memo, useMemo } from 'react';
import { FlatList } from 'react-native';

import { useTranslation } from '@/i18n';
import { CHIP_ROW_FLAT_LIST_PROPS } from '@/list';
import { testIds } from '@/testing/testIds';

import { categoryFilterKeyExtractor, createCategoryFilterRenderItem } from '../list';
import { useManageAppsStyles } from '../styles';
import type { CategoryFilterOption } from '../types';

type CategoryFiltersProps = {
  filters: CategoryFilterOption[];
  activeCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
};

const areCategoryFiltersPropsEqual = (previous: CategoryFiltersProps, next: CategoryFiltersProps): boolean => {
  if (previous.activeCategoryId !== next.activeCategoryId || previous.onCategoryChange !== next.onCategoryChange) {
    return false;
  }

  if (previous.filters.length !== next.filters.length) {
    return false;
  }

  for (let index = 0; index < previous.filters.length; index += 1) {
    const left = previous.filters[index];
    const right = next.filters[index];

    if (!left || !right || left.id !== right.id || left.label !== right.label) {
      return false;
    }
  }

  return true;
};

export const CategoryFilters = memo(({ filters, activeCategoryId, onCategoryChange }: CategoryFiltersProps) => {
  const styles = useManageAppsStyles();
  const { t } = useTranslation();
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
      style={styles.filters}
      contentContainerStyle={styles.filtersContent}
      testID={testIds.manageApps.categoryFilters}
      accessibilityRole="list"
      accessibilityLabel={t('manageApps.categoryFiltersA11y')}
      extraData={activeCategoryId}
      {...CHIP_ROW_FLAT_LIST_PROPS}
    />
  );
}, areCategoryFiltersPropsEqual);
