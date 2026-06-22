/** @format */

import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';

import type { LegalDocumentId } from '@/domain/types/legal';
import { useGoBack } from '@/hooks/useGoBack';
import { useTheme } from '@/hooks/useTheme';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { useRootNavigation } from '@/navigation';
import { testIds } from '@/testing/testIds';

import { createDarkModeToggle, createDataPrivacyLink, createNotificationsToggle } from './data/preferences';
import { useNotificationsSetting } from './hooks/useNotificationsSetting';
import { useThemeSetting } from './hooks/useThemeSetting';
import { createSettingsStyles } from './styles';

import {
  SettingsFooter,
  SettingsHeader,
  SettingsLinkRow,
  SettingsPrivacyBanner,
  SettingsSection,
  SettingsToggleRow,
} from './components';
import { ScreenSafeArea } from '@/components';

export const SettingsScreen = () => {
  const styles = useThemedStyles(createSettingsStyles);
  const { colors } = useTheme();
  const navigation = useRootNavigation();
  const goBack = useGoBack();
  const { isEnabled: notificationsEnabled, setEnabled: setNotificationsEnabled } = useNotificationsSetting();
  const { isDarkModeEnabled, description: themeDescription, setDarkModeEnabled } = useThemeSetting();

  const notificationsToggle = createNotificationsToggle(colors);
  const darkModeToggle = { ...createDarkModeToggle(colors), description: themeDescription };
  const dataPrivacyLink = createDataPrivacyLink(colors);

  const openLegalDocument = useCallback(
    (documentId: LegalDocumentId) => {
      navigation.navigate('LegalDocument', { documentId });
    },
    [navigation],
  );

  return (
    <ScreenSafeArea style={styles.screen} testID={testIds.settings.screen} accessibilityLabel="Settings">
      <ScrollView
        testID={testIds.settings.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SettingsHeader onBack={goBack} />

        <View style={styles.sections}>
          <SettingsSection title="Preferences" testID={testIds.settings.preferencesSection}>
            <SettingsToggleRow {...darkModeToggle} value={isDarkModeEnabled} onValueChange={setDarkModeEnabled} />
            <View style={styles.rowDivider} />
            <SettingsToggleRow
              {...notificationsToggle}
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </SettingsSection>

          <SettingsSection title="Privacy & Security" testID={testIds.settings.privacySection}>
            <SettingsLinkRow {...dataPrivacyLink} onPress={() => openLegalDocument('dataPrivacy')} />
          </SettingsSection>

          <SettingsPrivacyBanner />
        </View>

        <SettingsFooter onTermsPress={() => openLegalDocument('termsPrivacy')} />
      </ScrollView>
    </ScreenSafeArea>
  );
};
