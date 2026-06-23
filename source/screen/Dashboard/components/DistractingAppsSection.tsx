import React, { memo, useLayoutEffect, useMemo, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';

import { getManageAppKey } from '@/domain/appKey';
import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';
import { spacing } from '@/theme';
import { configureSectionLayoutAnimation } from '@/utils/layoutAnimation';
import type { DashboardAppRow } from '@/utils/usage/dashboardStats';

import { DistractingAppsListEmpty } from '../list/empty';
import { useDashboardStyles } from '../styles';

import { AppUsageRow } from '@/components';

const MAX_VISIBLE_APPS = 4;

type DistractingAppsSectionProps = {
  appRows: DashboardAppRow[];
  onConfigureLimits: (appKey: string) => void;
  onViewAllPress: () => void;
};

const areVisibleAppRowsEqual = (previous: DashboardAppRow[], next: DashboardAppRow[]): boolean => {
  const visibleCount = Math.min(MAX_VISIBLE_APPS, previous.length, next.length);

  for (let index = 0; index < visibleCount; index += 1) {
    const left = previous[index];
    const right = next[index];

    if (
      !left ||
      !right ||
      getManageAppKey(left) !== getManageAppKey(right) ||
      left.usedMs !== right.usedMs ||
      left.limitMs !== right.limitMs ||
      left.percentUsed !== right.percentUsed ||
      left.isOverLimit !== right.isOverLimit
    ) {
      return false;
    }
  }

  return true;
};

const areDistractingAppsSectionPropsEqual = (
  previous: DistractingAppsSectionProps,
  next: DistractingAppsSectionProps,
): boolean =>
  previous.appRows.length === next.appRows.length &&
  areVisibleAppRowsEqual(previous.appRows, next.appRows) &&
  previous.onConfigureLimits === next.onConfigureLimits &&
  previous.onViewAllPress === next.onViewAllPress;

export const DistractingAppsSection = memo(
  ({ appRows, onConfigureLimits, onViewAllPress }: DistractingAppsSectionProps) => {
    const styles = useDashboardStyles();
    const { t } = useTranslation();
    const visibleApps = useMemo(() => appRows.slice(0, MAX_VISIBLE_APPS), [appRows]);
    const previousAppsCount = useRef(visibleApps.length);

    useLayoutEffect(() => {
      if (previousAppsCount.current !== visibleApps.length) {
        configureSectionLayoutAnimation();
        previousAppsCount.current = visibleApps.length;
      }
    }, [visibleApps.length]);

    return (
      <View style={styles.section} testID={testIds.dashboard.distractingAppsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle} accessibilityRole="header" numberOfLines={1}>
            {t('dashboard.distractingApps')}
          </Text>
          {appRows.length > MAX_VISIBLE_APPS ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('dashboard.viewAllAppsA11y')}
              onPress={onViewAllPress}
              style={styles.viewAllButton}
              testID={testIds.dashboard.viewAllAppsButton}
            >
              <Text style={styles.viewAllText}>{t('common.viewAll')}</Text>
            </Pressable>
          ) : null}
        </View>

        <View
          style={[styles.appsList, { gap: spacing.md }]}
          testID={testIds.dashboard.appsList}
          accessibilityRole="list"
        >
          {visibleApps.length === 0 ? (
            <DistractingAppsListEmpty />
          ) : (
            visibleApps.map((app) => <AppUsageRow key={getManageAppKey(app)} {...app} onPress={onConfigureLimits} />)
          )}
        </View>
      </View>
    );
  },
  areDistractingAppsSectionPropsEqual,
);
