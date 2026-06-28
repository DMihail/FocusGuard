/** @format */

import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { useFormatUsage } from '@/hooks/useFormatUsage';
import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';
import type { TopAppUsageStat } from '@/utils/usage/statistics';

import { useStatisticsStyles } from '../styles';

import { AppIcon, ProgressBar } from '@/components';

type TopAppsSectionProps = {
  apps: TopAppUsageStat[];
};

const areTopAppsSectionPropsEqual = (previous: TopAppsSectionProps, next: TopAppsSectionProps): boolean =>
  previous.apps.length === next.apps.length &&
  previous.apps.every(
    (app, index) =>
      app.appKey === next.apps[index]?.appKey &&
      app.usedMs === next.apps[index]?.usedMs &&
      app.appName === next.apps[index]?.appName,
  );

export const TopAppsSection = memo(({ apps }: TopAppsSectionProps) => {
  const styles = useStatisticsStyles();
  const { t } = useTranslation();
  const { formatUsageMinutes } = useFormatUsage();
  const maxUsedMs = apps[0]?.usedMs ?? 1;

  return (
    <View style={styles.chartCard} testID={testIds.statistics.topApps}>
      <Text style={styles.chartTitle}>{t('statistics.topDistractingApps')}</Text>

      {apps.length === 0 ? (
        <Text style={styles.emptyText}>{t('statistics.noUsageData')}</Text>
      ) : (
        <View style={styles.topAppsList}>
          {apps.map((app) => {
            const progress = Math.round((app.usedMs / maxUsedMs) * 100);
            const usageLabel = formatUsageMinutes(app.usedMs);

            return (
              <View key={app.appKey} style={styles.topAppRow} testID={testIds.statistics.topAppRow(app.appKey)}>
                <View style={styles.topAppIcon}>
                  <AppIcon appImage={app.appImage} appName={app.appName} size="sm" />
                </View>

                <View style={styles.topAppContent}>
                  <View style={styles.topAppHeader}>
                    <Text style={styles.topAppName} numberOfLines={1}>
                      {app.appName}
                    </Text>
                    <Text style={styles.topAppTime}>{usageLabel}</Text>
                  </View>

                  <ProgressBar
                    progress={progress}
                    height={8}
                    accessibilityRole="progressbar"
                    accessibilityLabel={t('statistics.appUsageA11y', { appName: app.appName, time: usageLabel })}
                    accessibilityValue={{ min: 0, max: 100, now: progress }}
                  />
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}, areTopAppsSectionPropsEqual);

TopAppsSection.displayName = 'TopAppsSection';
