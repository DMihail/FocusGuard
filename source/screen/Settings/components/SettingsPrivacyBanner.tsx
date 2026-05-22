/** @format */

import React from 'react';
import { Text, View } from 'react-native';
import { LockPrivacyIcon } from '@/assets/svg/Settings';
import { SETTINGS_PRIVACY_BANNER } from '@/content/privacy';
import { colors } from '@/theme';
import { testIds } from '@/testing/testIds';
import { settingsStyles } from '../styles';

export const SettingsPrivacyBanner = () => (
  <View style={settingsStyles.privacyBanner} testID={testIds.settings.privacyBanner}>
    <View style={settingsStyles.privacyIconBox}>
      <LockPrivacyIcon stroke={colors.accent} />
    </View>
    <View style={settingsStyles.privacyTextBlock}>
      <Text style={settingsStyles.privacyTitle}>Your Privacy Matters</Text>
      <Text style={settingsStyles.privacyBody}>{SETTINGS_PRIVACY_BANNER}</Text>
    </View>
  </View>
);
