/** @format */

import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { useGoBack } from '@/hooks/useGoBack';
import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';

import { useStatistics } from './hooks/useStatistics';
import { useStatisticsStyles } from './styles';

import { FocusScoreTrendChart } from './components/FocusScoreTrendChart';
import { PeriodToggle } from './components/PeriodToggle';
import { StatisticsHeader } from './components/StatisticsHeader';
import { SummaryCards } from './components/SummaryCards';
import { TopAppsSection } from './components/TopAppsSection';
import { UsageSavedChart } from './components/UsageSavedChart';
import { ScreenSafeArea, UsageRefreshIndicator } from '@/components';

export const StatisticsScreen = () => {
  const styles = useStatisticsStyles();
  const goBack = useGoBack();
  const { t } = useTranslation();
  const {
    period,
    setPeriod,
    summary,
    usageChart,
    focusTrend,
    topApps,
    chartMaxMinutes,
    hasSelectedApps,
    isHistoryReady,
    showUsageRefreshIndicator,
    isPullRefreshing,
    refreshControl,
  } = useStatistics();

  return (
    <ScreenSafeArea
      style={styles.screen}
      testID={testIds.statistics.screen}
      accessibilityLabel={t('statistics.screenLabel')}
    >
      <View style={styles.content}>
        <ScrollView
          testID={testIds.statistics.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={refreshControl}
        >
          <StatisticsHeader onBack={goBack} />

          <PeriodToggle period={period} onChange={setPeriod} />

          {!hasSelectedApps ? (
            <Text style={styles.emptyText}>{t('statistics.noAppsSelected')}</Text>
          ) : !isHistoryReady ? null : (
            <>
              <SummaryCards summary={summary} />
              <UsageSavedChart points={usageChart} maxMinutes={chartMaxMinutes} />
              <FocusScoreTrendChart points={focusTrend} />
              <TopAppsSection apps={topApps} />
            </>
          )}
        </ScrollView>

        <UsageRefreshIndicator
          visible={showUsageRefreshIndicator && !isPullRefreshing}
          testID={testIds.statistics.usageLoader}
        />
      </View>
    </ScreenSafeArea>
  );
};
