/** @format */

import React from 'react';
import { Text, View } from 'react-native';

import { LockPrivacyIcon } from '@/assets/svg/Settings';
import { getSettingsPrivacyBanner } from '@/content/privacy';
import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';

import { settingsStyles } from '../styles';

export const SettingsPrivacyBanner = () => (
  <View style={settingsStyles.privacyBanner} testID={testIds.settings.privacyBanner}>
    <View style={settingsStyles.privacyIconBox}>
      <LockPrivacyIcon stroke={colors.accent} />
    </View>
    <View style={settingsStyles.privacyTextBlock}>
      <Text style={settingsStyles.privacyTitle}>Your Privacy Matters</Text>
      <Text style={settingsStyles.privacyBody}>{getSettingsPrivacyBanner()}</Text>
    </View>
  </View>
);
