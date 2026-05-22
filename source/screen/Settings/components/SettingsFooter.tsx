/** @format */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { testIds } from '@/testing/testIds';
import { APP_VERSION } from '../constants';
import { settingsStyles } from '../styles';

type SettingsFooterProps = {
  onTermsPress?: () => void;
};

export const SettingsFooter = ({ onTermsPress }: SettingsFooterProps) => (
  <View style={settingsStyles.footer} testID={testIds.settings.footer}>
    <Text style={settingsStyles.version} testID={testIds.settings.version}>
      {`FocusGuard v${APP_VERSION}`}
    </Text>
    <Pressable
      testID={testIds.settings.termsButton}
      accessibilityRole="button"
      accessibilityLabel="Terms and Privacy"
      onPress={onTermsPress}
    >
      <Text style={settingsStyles.termsLink}>Terms & Privacy</Text>
    </Pressable>
  </View>
);
