/** @format */

import React from 'react';
import { ScrollView, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useGoBack } from '@/hooks/useGoBack';
import { useRootNavigation } from '@/navigation';
import type { LegalDocumentId } from '@/screen/Legal';
import { testIds } from '@/testing/testIds';

import { DATA_PRIVACY_LINK, NOTIFICATIONS_TOGGLE } from './data/preferences';
import { useNotificationsSetting } from './hooks/useNotificationsSetting';
import { settingsStyles } from './styles';

import {
  SettingsFooter,
  SettingsHeader,
  SettingsLinkRow,
  SettingsPrivacyBanner,
  SettingsSection,
  SettingsToggleRow,
} from './components';

export const SettingsScreen = () => {
  const navigation = useRootNavigation();
  const goBack = useGoBack();
  const { isEnabled: notificationsEnabled, setEnabled: setNotificationsEnabled } = useNotificationsSetting();

  const openLegalDocument = (documentId: LegalDocumentId) => {
    navigation.navigate('LegalDocument', { documentId });
  };

  return (
    <SafeAreaView style={settingsStyles.screen} edges={['top', 'bottom']} testID={testIds.settings.screen}>
      <ScrollView
        testID={testIds.settings.scroll}
        contentContainerStyle={settingsStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SettingsHeader onBack={goBack} />

        <View style={settingsStyles.sections}>
          <SettingsSection title="Preferences" testID={testIds.settings.preferencesSection}>
            <SettingsToggleRow
              {...NOTIFICATIONS_TOGGLE}
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </SettingsSection>

          <SettingsSection title="Privacy & Security" testID={testIds.settings.privacySection}>
            <SettingsLinkRow {...DATA_PRIVACY_LINK} onPress={() => openLegalDocument('dataPrivacy')} />
          </SettingsSection>

          <SettingsPrivacyBanner />
        </View>

        <SettingsFooter onTermsPress={() => openLegalDocument('termsPrivacy')} />
      </ScrollView>
    </SafeAreaView>
  );
};
