/** @format */

import React, { memo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import Animated from 'react-native-reanimated';

import { CloseIcon } from '@/assets/svg/ManageApps';
import { testIds } from '@/testing/testIds';

import { useSelectedAppsAccordion } from '../hooks/useSelectedAppsAccordion';
import { manageAppsStyles, selectedAppsSectionExpandedHeight } from '../styles';
import type { ManageApp, SelectedAppsSectionProps } from '../types';

type SelectedChipProps = {
  app: ManageApp;
  onPress: (packageName: string) => void;
  onRemove: (app: ManageApp) => void;
};

const areSelectedChipPropsEqual = (previous: SelectedChipProps, next: SelectedChipProps): boolean =>
  previous.app.packageName === next.app.packageName &&
  previous.app.appName === next.app.appName &&
  previous.onPress === next.onPress &&
  previous.onRemove === next.onRemove;

const SelectedChip = memo(
  ({ app, onPress, onRemove }: SelectedChipProps) => (
    <View style={manageAppsStyles.selectedChip} testID={testIds.manageApps.selectedChip(app.packageName)}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Configure limits for ${app.appName}`}
        onPress={() => onPress(app.packageName)}
        style={manageAppsStyles.selectedChipBody}
        testID={testIds.manageApps.selectedChipPress(app.packageName)}
      >
        <Text style={manageAppsStyles.selectedChipLabel} numberOfLines={1}>
          {app.appName}
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Remove ${app.appName} from selected apps`}
        onPress={() => onRemove(app)}
        style={manageAppsStyles.selectedChipRemove}
        hitSlop={8}
        testID={testIds.manageApps.selectedChipRemove(app.packageName)}
      >
        <CloseIcon />
      </Pressable>
    </View>
  ),
  areSelectedChipPropsEqual,
);

export const SelectedAppsSection = ({ apps, onAppPress, onAppRemove }: SelectedAppsSectionProps) => {
  const isExpanded = apps.length > 0;
  const containerStyle = useSelectedAppsAccordion(isExpanded, selectedAppsSectionExpandedHeight);

  return (
    <Animated.View
      style={[manageAppsStyles.selectedAppsSectionOuter, containerStyle]}
      testID={testIds.manageApps.selectedSection}
      pointerEvents={isExpanded ? 'auto' : 'none'}
      collapsable={false}
    >
      <View style={manageAppsStyles.section}>
        <Text accessibilityRole="header" style={manageAppsStyles.sectionTitle}>
          Selected Apps
        </Text>

        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          style={manageAppsStyles.selectedAppsScroll}
          testID={testIds.manageApps.selectedAppsScroll}
        >
          <View style={manageAppsStyles.selectedAppsRows}>
            {apps.map((app) => (
              <SelectedChip key={app.packageName} app={app} onPress={onAppPress} onRemove={onAppRemove} />
            ))}
          </View>
        </ScrollView>
      </View>
    </Animated.View>
  );
};
