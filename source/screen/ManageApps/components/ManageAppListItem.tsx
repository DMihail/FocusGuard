/** @format */

import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { CheckIcon } from '@/assets/svg/EnablePermissions';
import { testIds } from '@/testing/testIds';

import { manageAppsStyles } from '../styles';
import type { ManageApp } from '../types';

import { AppIcon } from '@/components';

type ManageAppListItemProps = ManageApp & {
  isSelected: boolean;
  onToggle: () => void;
};

export const ManageAppListItem = memo(
  ({ packageName, appName, appImage, categoryLabel, isSelected, onToggle }: ManageAppListItemProps) => (
    <Pressable
      testID={testIds.manageApps.appRow(packageName)}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${appName}, ${categoryLabel}`}
      style={manageAppsStyles.appItem}
      onPress={onToggle}
    >
      <AppIcon
        appName={appName}
        appImage={appImage}
        size="sm"
        boxStyle={manageAppsStyles.appIconBox}
        imageStyle={manageAppsStyles.appIcon}
        fallbackStyle={manageAppsStyles.appIconFallback}
      />

      <View style={manageAppsStyles.appInfo}>
        <Text style={manageAppsStyles.appName} numberOfLines={1}>
          {appName}
        </Text>
        <Text style={manageAppsStyles.appCategory}>{categoryLabel}</Text>
      </View>

      <View
        testID={testIds.manageApps.appSelectionControl(packageName)}
        style={[manageAppsStyles.selectionControl, isSelected && manageAppsStyles.selectionControlSelected]}
      >
        {isSelected ? <CheckIcon /> : null}
      </View>
    </Pressable>
  ),
);

ManageAppListItem.displayName = 'ManageAppListItem';
