import React, { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useGoBack } from '@/hooks/useGoBack';
import { useTranslation } from '@/i18n';
import { LIMIT_SLIDER_BOUNDS } from '@/store';
import { testIds } from '@/testing/testIds';

import { LIMIT_CARD_COLORS } from './constants';
import { useConfigureLimits } from './hooks/useConfigureLimits';
import { useConfigureLimitsStyles } from './styles';
import type { ConfigureLimitsScreenProps } from './types';

import { AppLimitsAppBadge } from './components/AppLimitsAppBadge';
import { ConfigureLimitsHeader } from './components/ConfigureLimitsHeader';
import { DailyUsageCard } from './components/DailyUsageCard';
import { LimitSliderCard } from './components/LimitSliderCard';
import { StrictModeCard } from './components/StrictModeCard';
import { ScreenSafeArea } from '@/components';

export const ConfigureLimitsScreen = ({ route }: ConfigureLimitsScreenProps) => {
  const styles = useConfigureLimitsStyles();
  const { t } = useTranslation();
  const { appKey } = route.params;
  const goBack = useGoBack();
  const {
    app,
    draft,
    hardBlockMin,
    usedMsToday,
    limitMsToday,
    setWarningMinutes,
    setHardBlockMinutes,
    setStrictMode,
    save,
  } = useConfigureLimits(appKey);

  const handleSave = useCallback(() => {
    save();
    goBack();
  }, [goBack, save]);

  if (!app) {
    return (
      <ScreenSafeArea
        style={styles.screen}
        testID={testIds.configureLimits.unknownAppScreen}
        accessibilityLabel={t('configureLimits.screenLabelUnknown')}
      >
        <ConfigureLimitsHeader appName={t('common.unknownApp')} onBack={goBack} />
      </ScreenSafeArea>
    );
  }

  return (
    <ScreenSafeArea
      style={styles.screen}
      testID={testIds.configureLimits.screen}
      accessibilityLabel={t('configureLimits.screenLabel')}
    >
      <ScrollView
        testID={testIds.configureLimits.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ConfigureLimitsHeader appName={app.appName} onBack={goBack} />

        <AppLimitsAppBadge
          appName={app.appName}
          appImage={app.appImage}
          testID={testIds.configureLimits.appBadge(appKey)}
        />

        <DailyUsageCard appKey={appKey} usedMs={usedMsToday} limitMs={limitMsToday} />

        <View style={styles.cards}>
          <LimitSliderCard
            testID={testIds.configureLimits.warningCard}
            decreaseTestID={testIds.configureLimits.warningDecrease}
            increaseTestID={testIds.configureLimits.warningIncrease}
            trackTestID={testIds.configureLimits.warningTrack}
            title={t('configureLimits.dailyWarningTitle')}
            description={t('configureLimits.dailyWarningDescription')}
            valueMinutes={draft.warningMinutes}
            minMinutes={LIMIT_SLIDER_BOUNDS.warning.min}
            maxMinutes={LIMIT_SLIDER_BOUNDS.warning.max}
            stepMinutes={LIMIT_SLIDER_BOUNDS.warning.step}
            accentColor={LIMIT_CARD_COLORS.warning}
            onChange={setWarningMinutes}
          />

          <LimitSliderCard
            testID={testIds.configureLimits.hardBlockCard}
            decreaseTestID={testIds.configureLimits.hardBlockDecrease}
            increaseTestID={testIds.configureLimits.hardBlockIncrease}
            trackTestID={testIds.configureLimits.hardBlockTrack}
            title={t('configureLimits.dailyLimitTitle')}
            description={t('configureLimits.dailyLimitDescription')}
            valueMinutes={draft.hardBlockMinutes}
            minMinutes={hardBlockMin}
            progressMinMinutes={LIMIT_SLIDER_BOUNDS.hardBlock.min}
            maxMinutes={LIMIT_SLIDER_BOUNDS.hardBlock.max}
            stepMinutes={LIMIT_SLIDER_BOUNDS.hardBlock.step}
            accentColor={LIMIT_CARD_COLORS.hardBlock}
            onChange={setHardBlockMinutes}
          />
        </View>

        <StrictModeCard
          testID={testIds.configureLimits.strictModeCard}
          toggleTestID={testIds.configureLimits.strictModeToggle}
          value={draft.strictMode}
          onValueChange={setStrictMode}
        />

        <View style={styles.footer}>
          <Pressable
            testID={testIds.configureLimits.saveButton}
            accessibilityRole="button"
            accessibilityLabel={t('configureLimits.saveA11y')}
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonLabel}>{t('configureLimits.save')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenSafeArea>
  );
};
