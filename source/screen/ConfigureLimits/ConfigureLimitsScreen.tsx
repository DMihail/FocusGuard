/** @format */

import React, { useCallback } from 'react';
import { Image, Pressable, ScrollView, Switch, Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useRootNavigation } from '@/navigation';
import { LIMIT_SLIDER_BOUNDS } from '@/store';
import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';

import { LIMIT_CARD_COLORS } from './constants';
import { useConfigureLimits } from './hooks/useConfigureLimits';
import { configureLimitsStyles as styles } from './styles';
import type { ConfigureLimitsScreenProps } from './types';

import { ConfigureLimitsHeader } from './components/ConfigureLimitsHeader';
import { LimitSliderCard } from './components/LimitSliderCard';

export const ConfigureLimitsScreen = ({ route }: ConfigureLimitsScreenProps) => {
  const navigation = useRootNavigation();
  const { packageName } = route.params;
  const { app, draft, hardBlockMin, setWarningMinutes, setHardBlockMinutes, setStrictMode, save } =
    useConfigureLimits(packageName);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSave = useCallback(() => {
    save();
    navigation.goBack();
  }, [navigation, save]);

  if (!app) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <ConfigureLimitsHeader appName="Unknown app" onBack={handleBack} />
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
        <ConfigureLimitsHeader appName={app.appName} onBack={handleBack} />

        <View style={styles.appBadge} testID={testIds.configureLimits.appBadge(packageName)}>
          <View style={styles.appIconBox}>
            {app.appImage ? (
              <Image source={{ uri: app.appImage }} style={styles.appIcon} resizeMode="cover" />
            ) : (
              <Text style={styles.appIconFallback}>{app.appName.charAt(0).toUpperCase()}</Text>
            )}
          </View>
          <Text style={styles.appName} numberOfLines={1}>
            {app.appName}
          </Text>
        </View>

        <View style={styles.cards}>
          <LimitSliderCard
            testID={testIds.configureLimits.warningCard}
            title="Warning Threshold"
            description="You'll receive a gentle reminder when you reach this time"
            valueMinutes={draft.warningMinutes}
            minMinutes={LIMIT_SLIDER_BOUNDS.warning.min}
            maxMinutes={LIMIT_SLIDER_BOUNDS.warning.max}
            stepMinutes={LIMIT_SLIDER_BOUNDS.warning.step}
            accentColor={LIMIT_CARD_COLORS.warning}
            onChange={setWarningMinutes}
          />

          <LimitSliderCard
            testID={testIds.configureLimits.hardBlockCard}
            title="Hard Block"
            description="Apps will be blocked when you reach this limit"
            valueMinutes={draft.hardBlockMinutes}
            minMinutes={hardBlockMin}
            progressMinMinutes={LIMIT_SLIDER_BOUNDS.hardBlock.min}
            maxMinutes={LIMIT_SLIDER_BOUNDS.hardBlock.max}
            stepMinutes={LIMIT_SLIDER_BOUNDS.hardBlock.step}
            accentColor={LIMIT_CARD_COLORS.hardBlock}
            onChange={setHardBlockMinutes}
          />
        </View>

        <View style={styles.strictCard} testID={testIds.configureLimits.strictModeCard}>
          <View style={styles.strictText}>
            <Text style={styles.strictTitle}>Strict Mode</Text>
            <Text style={styles.strictDescription}>Disable the 5-minute snooze when blocked</Text>
          </View>
          <Switch
            testID={testIds.configureLimits.strictModeToggle}
            accessibilityRole="switch"
            accessibilityLabel="Strict mode"
            value={draft.strictMode}
            onValueChange={setStrictMode}
            trackColor={{ false: colors.switchTrackOff, true: colors.accent }}
            thumbColor={colors.textPrimary}
          />
        </View>

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
