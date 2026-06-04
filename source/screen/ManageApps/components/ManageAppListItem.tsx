/** @format */

import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { CheckIcon } from '@/assets/svg/EnablePermissions';
import { testIds } from '@/testing/testIds';

import { manageAppsStyles } from '../styles';
import type { ManageApp } from '../types';

import { AppIcon } from '@/components';

type ManageAppListItemProps = {
  app: ManageApp;
  isSelected: boolean;
  onToggle: (app: ManageApp) => void;
};

function ManageAppListItemView({ app, isSelected, onToggle }: ManageAppListItemProps) {
  const { packageName, appName, appImage, categoryLabel } = app;

  return (
    <Pressable
      testID={testIds.manageApps.appRow(packageName)}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${appName}, ${categoryLabel}`}
      style={manageAppsStyles.appItem}
      onPress={() => onToggle(app)}
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
  );
}

export const ManageAppListItem = memo(ManageAppListItemView, areManageAppListItemPropsEqual);

function areManageAppListItemPropsEqual(previous: ManageAppListItemProps, next: ManageAppListItemProps): boolean {
  return (
    previous.isSelected === next.isSelected &&
    previous.app.packageName === next.app.packageName &&
    previous.app.appName === next.app.appName &&
    previous.app.categoryLabel === next.app.categoryLabel &&
    previous.onToggle === next.onToggle
  );
}
