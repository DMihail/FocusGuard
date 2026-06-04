/** @format */

import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { LIMIT_SLIDER_BOUNDS } from '@/store';
import { testIds } from '@/testing/testIds';

import { LIMIT_CARD_COLORS } from './constants';
import { useConfigureLimitsScreen } from './hooks/useConfigureLimitsScreen';
import { configureLimitsStyles as styles } from './styles';
import type { ConfigureLimitsScreenProps } from './types';

import { AppLimitsAppBadge } from './components/AppLimitsAppBadge';
import { ConfigureLimitsHeader } from './components/ConfigureLimitsHeader';
import { DailyUsageCard } from './components/DailyUsageCard';
import { LimitSliderCard } from './components/LimitSliderCard';
import { StrictModeCard } from './components/StrictModeCard';

export const ConfigureLimitsScreen = ({ route }: ConfigureLimitsScreenProps) => {
  const { packageName } = route.params;
  const {
    app,
    draft,
    hardBlockMin,
    usedMsToday,
    limitMsToday,
    setWarningMinutes,
    setHardBlockMinutes,
    setStrictMode,
    goBack,
    handleSave,
  } = useConfigureLimitsScreen(packageName);

  if (!app) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <ConfigureLimitsHeader appName="Unknown app" onBack={goBack} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']} testID={testIds.configureLimits.screen}>
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
          testID={testIds.configureLimits.appBadge(packageName)}
        />

        <DailyUsageCard packageName={packageName} usedMs={usedMsToday} limitMs={limitMsToday} />

        <View style={styles.cards}>
          <LimitSliderCard
            testID={testIds.configureLimits.warningCard}
            title="Daily warning"
            description="Notification when today's usage reaches this time"
            valueMinutes={draft.warningMinutes}
            minMinutes={LIMIT_SLIDER_BOUNDS.warning.min}
            maxMinutes={LIMIT_SLIDER_BOUNDS.warning.max}
            stepMinutes={LIMIT_SLIDER_BOUNDS.warning.step}
            accentColor={LIMIT_CARD_COLORS.warning}
            onChange={setWarningMinutes}
          />

          <LimitSliderCard
            testID={testIds.configureLimits.hardBlockCard}
            title="Daily limit"
            description="App is blocked immediately when you open it after today's limit is reached"
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
            accessibilityLabel="Save limits"
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonLabel}>Save Limits</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
