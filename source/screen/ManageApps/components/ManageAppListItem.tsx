/** @format */

import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { CheckIcon } from '../../../assets/svg/EnablePermissions';
import { testIds } from '../../../testing/testIds';
import type { ManageApp } from '../types';
import { manageAppsStyles } from '../styles';

type ManageAppListItemProps = ManageApp & {
  isSelected: boolean;
  onToggle: () => void;
};

export const ManageAppListItem = ({
  packageName,
  appName,
  appImage,
  categoryLabel,
  isSelected,
  onToggle,
}: ManageAppListItemProps) => (
  <Pressable
    testID={testIds.manageApps.appRow(packageName)}
    accessibilityRole="button"
    accessibilityState={{ selected: isSelected }}
    accessibilityLabel={`${appName}, ${categoryLabel}`}
    style={manageAppsStyles.appItem}
    onPress={onToggle}
  >
    <View style={manageAppsStyles.appIconBox}>
      {appImage ? (
        <Image source={{ uri: appImage }} style={manageAppsStyles.appIcon} resizeMode="cover" />
      ) : (
        <Text style={manageAppsStyles.appIconFallback}>{appName.charAt(0).toUpperCase()}</Text>
      )}
    </View>

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
);
