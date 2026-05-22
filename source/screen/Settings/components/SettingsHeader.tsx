/** @format */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { BackIcon } from '@/assets/svg/ManageApps';
import { testIds } from '@/testing/testIds';
import { settingsStyles } from '../styles';

type SettingsHeaderProps = {
  onBack: () => void;
};

export const SettingsHeader = ({ onBack }: SettingsHeaderProps) => (
  <View style={settingsStyles.header} testID={testIds.settings.header}>
    <Pressable
      testID={testIds.settings.backButton}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      style={settingsStyles.backButton}
      onPress={onBack}
    >
      <BackIcon />
    </Pressable>

    <View style={settingsStyles.headerText}>
      <Text style={settingsStyles.title}>Settings</Text>
      <Text style={settingsStyles.subtitle}>Customize your experience</Text>
    </View>
  </View>
);
