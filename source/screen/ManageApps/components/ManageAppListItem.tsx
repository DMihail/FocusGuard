/** @format */

import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { CheckIcon } from '@/assets/svg/EnablePermissions';
import { getManageAppKey } from '@/domain/appKey';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { testIds } from '@/testing/testIds';

import { createManageAppsStyles } from '../styles';
import type { ManageApp } from '../types';

import { AppIcon } from '@/components';

type ManageAppListItemProps = {
  app: ManageApp;
  isSelected: boolean;
  onToggle: (app: ManageApp) => void;
};

export const ManageAppListItem = memo(({ app, isSelected, onToggle }: ManageAppListItemProps) => {
  const styles = useThemedStyles(createManageAppsStyles);
  const { appName, appImage, categoryLabel } = app;
  const appKey = getManageAppKey(app);

  return (
    <Pressable
      testID={testIds.manageApps.appRow(appKey)}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${appName}, ${categoryLabel}`}
      style={styles.appItem}
      onPress={() => onToggle(app)}
    >
      <AppIcon
        appName={appName}
        appImage={appImage}
        size="sm"
        boxStyle={styles.appIconBox}
        imageStyle={styles.appIcon}
        fallbackStyle={styles.appIconFallback}
      />

      <View style={styles.appInfo}>
        <Text style={styles.appName} numberOfLines={1}>
          {appName}
        </Text>
        <Text style={styles.appCategory}>{categoryLabel}</Text>
      </View>

      <View
        testID={testIds.manageApps.appSelectionControl(appKey)}
        style={[styles.selectionControl, isSelected && styles.selectionControlSelected]}
      >
        {isSelected ? <CheckIcon /> : null}
      </View>
    </Pressable>
  );
}, areManageAppListItemPropsEqual);

function areManageAppListItemPropsEqual(previous: ManageAppListItemProps, next: ManageAppListItemProps): boolean {
  return (
    previous.isSelected === next.isSelected &&
    getManageAppKey(previous.app) === getManageAppKey(next.app) &&
    previous.app.appName === next.app.appName &&
    previous.app.appImage === next.app.appImage &&
    previous.app.categoryLabel === next.app.categoryLabel &&
    previous.onToggle === next.onToggle
  );
}
