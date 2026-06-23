import React, { memo, useMemo } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';

import Animated from 'react-native-reanimated';

import { CloseIcon } from '@/assets/svg/ManageApps';
import { getManageAppKey } from '@/domain/appKey';
import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';

import { useSelectedAppsAccordion } from '../hooks/useSelectedAppsAccordion';
import { useSelectedAppsCollapse } from '../hooks/useSelectedAppsCollapse';
import { getSelectedAppsLayout } from '../selectedAppsLayout';
import { useManageAppsStyles } from '../styles';
import type { ManageApp, SelectedAppsSectionProps } from '../types';
import { areManageAppListsEqual, isSameManageAppForDisplay } from '../utils/areManageAppListsEqual';

type SelectedChipProps = {
  app: ManageApp;
  onPress: (appKey: string) => void;
  onRemove: (app: ManageApp) => void;
};

const areSelectedChipPropsEqual = (previous: SelectedChipProps, next: SelectedChipProps): boolean =>
  isSameManageAppForDisplay(previous.app, next.app) &&
  previous.onPress === next.onPress &&
  previous.onRemove === next.onRemove;

const SelectedChip = memo(({ app, onPress, onRemove }: SelectedChipProps) => {
  const styles = useManageAppsStyles();
  const { t } = useTranslation();
  const appKey = getManageAppKey(app);

  const handlePress = () => onPress(appKey);
  const handleRemove = () => onRemove(app);

  return (
    <View style={styles.selectedChip} testID={testIds.manageApps.selectedChip(appKey)}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('manageApps.configureLimitsA11y', { appName: app.appName })}
        onPress={handlePress}
        style={styles.selectedChipBody}
        testID={testIds.manageApps.selectedChipPress(appKey)}
      >
        <Text style={styles.selectedChipLabel} numberOfLines={1}>
          {app.appName}
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('manageApps.removeAppA11y', { appName: app.appName })}
        onPress={handleRemove}
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
): boolean =>
  previous.onAppPress === next.onAppPress &&
  previous.onAppRemove === next.onAppRemove &&
  areManageAppListsEqual(previous.apps, next.apps);

export const SelectedAppsSection = memo(({ apps, onAppPress, onAppRemove }: SelectedAppsSectionProps) => {
  const styles = useManageAppsStyles();
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();
  const { visibleApps, showContent, isExpanded, handleCollapseEnd } = useSelectedAppsCollapse(apps);

  const layout = useMemo(
    () => getSelectedAppsLayout(windowWidth, visibleApps.length),
    [visibleApps.length, windowWidth],
  );
  const expandedHeight = showContent ? layout.expandedHeight : 0;
  const containerStyle = useSelectedAppsAccordion(isExpanded, expandedHeight, handleCollapseEnd);

  const chipElements = useMemo(
    () =>
      visibleApps.map((app) => (
        <SelectedChip key={getManageAppKey(app)} app={app} onPress={onAppPress} onRemove={onAppRemove} />
      )),
    [onAppPress, onAppRemove, visibleApps],
  );

  const selectedAppsLabel = t('manageApps.selectedApps');

  const chipList = layout.usesColumnScroll ? (
    <ScrollView
      horizontal
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      style={styles.selectedAppsScroll}
      accessibilityRole="list"
      accessibilityLabel={selectedAppsLabel}
      testID={testIds.manageApps.selectedAppsScroll}
    >
      <View style={[styles.selectedAppsChipColumnStrip, { height: layout.columnStripHeight }]}>{chipElements}</View>
    </ScrollView>
  ) : (
    <View
      style={[styles.selectedAppsChipRowWrap, { width: layout.stripWidth }]}
      accessibilityRole="list"
      accessibilityLabel={selectedAppsLabel}
      testID={testIds.manageApps.selectedAppsScroll}
    >
      {chipElements}
    </View>
  );

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
            {selectedAppsLabel}
          </Text>
          {chipList}
        </View>
      ) : null}
    </Animated.View>
  );
}, areSelectedAppsSectionPropsEqual);
