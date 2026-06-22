/** @format */

import React, { memo, useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import Animated from 'react-native-reanimated';

import { CloseIcon } from '@/assets/svg/ManageApps';
import { getManageAppKey } from '@/domain/appKey';
import { testIds } from '@/testing/testIds';

import { SELECTED_APPS_ACCORDION_SETTLE_MS } from '../constants';
import { useSelectedAppsAccordion } from '../hooks/useSelectedAppsAccordion';
import { selectedAppsSectionExpandedHeight, useManageAppsStyles } from '../styles';
import type { ManageApp, SelectedAppsSectionProps } from '../types';

type SelectedChipProps = {
  app: ManageApp;
  onPress: (appKey: string) => void;
  onRemove: (app: ManageApp) => void;
};

const areSelectedChipPropsEqual = (previous: SelectedChipProps, next: SelectedChipProps): boolean =>
  getManageAppKey(previous.app) === getManageAppKey(next.app) &&
  previous.app.appName === next.app.appName &&
  previous.onPress === next.onPress &&
  previous.onRemove === next.onRemove;

const SelectedChip = memo(({ app, onPress, onRemove }: SelectedChipProps) => {
  const styles = useManageAppsStyles();
  const appKey = getManageAppKey(app);

  return (
    <View style={styles.selectedChip} testID={testIds.manageApps.selectedChip(appKey)}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Configure limits for ${app.appName}`}
        onPress={() => onPress(appKey)}
        style={styles.selectedChipBody}
        testID={testIds.manageApps.selectedChipPress(appKey)}
      >
        <Text style={styles.selectedChipLabel} numberOfLines={1}>
          {app.appName}
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Remove ${app.appName} from selected apps`}
        onPress={() => onRemove(app)}
        style={styles.selectedChipRemove}
        hitSlop={8}
        testID={testIds.manageApps.selectedChipRemove(appKey)}
      >
        <CloseIcon />
      </Pressable>
    </View>
  );
}, areSelectedChipPropsEqual);

const areSelectedAppsSectionPropsEqual = (
  previous: SelectedAppsSectionProps,
  next: SelectedAppsSectionProps,
): boolean => {
  if (previous.onAppPress !== next.onAppPress || previous.onAppRemove !== next.onAppRemove) {
    return false;
  }

  if (previous.apps.length !== next.apps.length) {
    return false;
  }

  for (let index = 0; index < previous.apps.length; index += 1) {
    const left = previous.apps[index];
    const right = next.apps[index];

    if (!left || !right || getManageAppKey(left) !== getManageAppKey(right) || left.appName !== right.appName) {
      return false;
    }
  }

  return true;
};

export const SelectedAppsSection = memo(({ apps, onAppPress, onAppRemove }: SelectedAppsSectionProps) => {
  const styles = useManageAppsStyles();
  const isExpanded = apps.length > 0;
  const [displayApps, setDisplayApps] = useState(apps);

  const handleCollapseEnd = useCallback(() => {
    setDisplayApps([]);
  }, []);

  const containerStyle = useSelectedAppsAccordion(isExpanded, selectedAppsSectionExpandedHeight, handleCollapseEnd);
  const showContent = isExpanded || displayApps.length > 0;

  useEffect(() => {
    if (isExpanded) {
      setDisplayApps(apps);
    }
  }, [apps, isExpanded]);

  useEffect(() => {
    if (isExpanded || displayApps.length === 0) {
      return undefined;
    }

    const timer = setTimeout(handleCollapseEnd, SELECTED_APPS_ACCORDION_SETTLE_MS);

    return () => clearTimeout(timer);
  }, [displayApps.length, handleCollapseEnd, isExpanded]);

  return (
    <Animated.View
      style={[styles.selectedAppsSectionOuter, containerStyle]}
      testID={testIds.manageApps.selectedSection}
      pointerEvents={isExpanded ? 'auto' : 'none'}
      collapsable={false}
    >
      {showContent ? (
        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Selected Apps
          </Text>

          <ScrollView
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.selectedAppsScroll}
            testID={testIds.manageApps.selectedAppsScroll}
          >
            <View style={styles.selectedAppsRows}>
              {displayApps.map((app) => (
                <SelectedChip key={getManageAppKey(app)} app={app} onPress={onAppPress} onRemove={onAppRemove} />
              ))}
            </View>
          </ScrollView>
        </View>
      ) : null}
    </Animated.View>
  );
}, areSelectedAppsSectionPropsEqual);
