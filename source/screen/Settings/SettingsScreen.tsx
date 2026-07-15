/** @format */

import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';

import type { LegalDocumentId } from '@/domain/types/legal';
import { useGoBack } from '@/hooks/useGoBack';
import { useScrollContentContainerStyle } from '@/hooks/useScrollContentContainerStyle';
import { useTranslation } from '@/i18n';
import { useRootNavigation } from '@/navigation';
import { testIds } from '@/testing/testIds';

import { useAccessibilityServiceSetting } from './hooks/useAccessibilityServiceSetting';
import { useNotificationsSetting } from './hooks/useNotificationsSetting';
import { useSettingsPreferences } from './hooks/useSettingsPreferences';
import { useSettingsStyles } from './styles';

import { SettingsFooter } from './components/SettingsFooter';
import { SettingsHeader } from './components/SettingsHeader';
import { SettingsLinkRow } from './components/SettingsLinkRow';
import { SettingsPrivacyBanner } from './components/SettingsPrivacyBanner';
import { SettingsSection } from './components/SettingsSection';
import { SettingsToggleRow } from './components/SettingsToggleRow';
import { ScreenSafeArea } from '@/components';

export const SettingsScreen = () => {
  const styles = useSettingsStyles();
  const { scrollContentContainerStyle } = useScrollContentContainerStyle(styles.scrollContent);
  const navigation = useRootNavigation();
  const goBack = useGoBack();
  const { t } = useTranslation();
  const { isEnabled: notificationsEnabled, setEnabled: setNotificationsEnabled } = useNotificationsSetting();
  const {
    isEnabled: accessibilityServiceEnabled,
    setEnabled: setAccessibilityServiceEnabled,
    isSupported: isAccessibilityServiceSupported,
  } = useAccessibilityServiceSetting();
  const {
    isDarkModeEnabled,
    setDarkModeEnabled,
    darkModeToggle,
    notificationsToggle,
    accessibilityToggle,
    languageLink,
    dataPrivacyLink,
    openLanguagePicker,
  } = useSettingsPreferences();

  const openLegalDocument = useCallback(
    (documentId: LegalDocumentId) => {
      navigation.navigate('LegalDocument', { documentId });
    },
    [navigation],
  );

  return (
    <ScreenSafeArea
      style={styles.screen}
      testID={testIds.settings.screen}
      accessibilityLabel={t('settings.screenLabel')}
    >
      <ScrollView
        testID={testIds.settings.scroll}
        contentContainerStyle={scrollContentContainerStyle}
        showsVerticalScrollIndicator={false}
      >
        <SettingsHeader onBack={goBack} />

        <View style={styles.sections}>
          <SettingsSection title={t('settings.preferences')} testID={testIds.settings.preferencesSection}>
            <SettingsToggleRow {...darkModeToggle} value={isDarkModeEnabled} onValueChange={setDarkModeEnabled} />
            <View style={styles.rowDivider} />
            <SettingsToggleRow
              {...notificationsToggle}
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
            {isAccessibilityServiceSupported && accessibilityToggle ? (
              <>
                <View style={styles.rowDivider} />
                <SettingsToggleRow
                  {...accessibilityToggle}
                  value={accessibilityServiceEnabled}
                  onValueChange={setAccessibilityServiceEnabled}
                />
              </>
            ) : null}
            <View style={styles.rowDivider} />
            <SettingsLinkRow {...languageLink} onPress={openLanguagePicker} />
          </SettingsSection>

          <SettingsSection title={t('settings.privacySection')} testID={testIds.settings.privacySection}>
            <SettingsLinkRow {...dataPrivacyLink} onPress={() => openLegalDocument('dataPrivacy')} />
          </SettingsSection>

          <SettingsPrivacyBanner />
        </View>

        <SettingsFooter onTermsPress={() => openLegalDocument('termsPrivacy')} />
      </ScrollView>
    </ScreenSafeArea>
  );
};
