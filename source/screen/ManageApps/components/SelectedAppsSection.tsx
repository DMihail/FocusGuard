/** @format */

import React, { memo, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';

import Animated from 'react-native-reanimated';

import { CloseIcon } from '@/assets/svg/ManageApps';
import { getManageAppKey } from '@/domain/appKey';
import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';

import { SELECTED_APPS_ACCORDION_SETTLE_MS } from '../constants';
import { useSelectedAppsAccordion } from '../hooks/useSelectedAppsAccordion';
import {
  chunkIntoRows,
  getSelectedAppsColumnStripHeight,
  getSelectedAppsColumnStripWidth,
  getSelectedAppsSectionExpandedHeight,
  getSelectedAppsStripWidth,
  getSelectedChipsPerRow,
  needsSelectedAppsHorizontalScroll,
} from '../selectedAppsLayout';
import { useManageAppsStyles } from '../styles';
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
  const { t } = useTranslation();
  const appKey = getManageAppKey(app);

  return (
    <View style={styles.selectedChip} testID={testIds.manageApps.selectedChip(appKey)}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('manageApps.configureLimitsA11y', { appName: app.appName })}
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
        accessibilityLabel={t('manageApps.removeAppA11y', { appName: app.appName })}
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
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();
  const isExpanded = apps.length > 0;
  const [retainedApps, setRetainedApps] = useState<ManageApp[]>([]);
  const visibleApps = isExpanded ? apps : retainedApps;
  const showContent = visibleApps.length > 0;

  const stripWidth = getSelectedAppsStripWidth(windowWidth);
  const chipsPerRow = getSelectedChipsPerRow(stripWidth);
  const usesColumnScroll = needsSelectedAppsHorizontalScroll(visibleApps.length, chipsPerRow);
  const columnStripHeight = getSelectedAppsColumnStripHeight();
  const expandedHeight = showContent ? getSelectedAppsSectionExpandedHeight(visibleApps.length, chipsPerRow) : 0;
  const canScrollHorizontally = usesColumnScroll && getSelectedAppsColumnStripWidth(visibleApps.length) > stripWidth;

  const handleCollapseEnd = useCallback(() => {
    setRetainedApps([]);
  }, []);

  const containerStyle = useSelectedAppsAccordion(isExpanded, expandedHeight, handleCollapseEnd);

  useLayoutEffect(() => {
    if (isExpanded) {
      setRetainedApps(apps);
    }
  }, [apps, isExpanded]);

  useEffect(() => {
    if (isExpanded || retainedApps.length === 0) {
      return undefined;
    }

    const timer = setTimeout(handleCollapseEnd, SELECTED_APPS_ACCORDION_SETTLE_MS);

    return () => clearTimeout(timer);
  }, [handleCollapseEnd, isExpanded, retainedApps.length]);

  const chipList = usesColumnScroll ? (
    <ScrollView
      horizontal
      nestedScrollEnabled
      scrollEnabled={canScrollHorizontally}
      showsHorizontalScrollIndicator={false}
      style={styles.selectedAppsScroll}
      testID={testIds.manageApps.selectedAppsScroll}
    >
      <View style={[styles.selectedAppsChipColumnStrip, { height: columnStripHeight }]}>
        {visibleApps.map((app) => (
          <SelectedChip key={getManageAppKey(app)} app={app} onPress={onAppPress} onRemove={onAppRemove} />
        ))}
      </View>
    </ScrollView>
  ) : (
    <View style={[styles.selectedAppsChipStrip, { width: stripWidth }]} testID={testIds.manageApps.selectedAppsScroll}>
      {chunkIntoRows(visibleApps, chipsPerRow).map((rowApps, rowIndex) => (
        <View key={rowIndex} style={styles.selectedAppsChipRow}>
          {rowApps.map((app) => (
            <SelectedChip key={getManageAppKey(app)} app={app} onPress={onAppPress} onRemove={onAppRemove} />
          ))}
        </View>
      ))}
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
            {t('manageApps.selectedApps')}
          </Text>
          {chipList}
        </View>
      ) : null}
    </Animated.View>
  );
}, areSelectedAppsSectionPropsEqual);
