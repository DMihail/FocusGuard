/** @format */

import React, { type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { settingsStyles } from '../styles';

type SettingsSectionProps = {
  title: string;
  testID?: string;
  children: ReactNode;
};

export const SettingsSection = ({ title, testID, children }: SettingsSectionProps) => (
  <View style={settingsStyles.section} testID={testID}>
    <Text style={settingsStyles.sectionLabel}>{title}</Text>
    <View style={settingsStyles.card}>{children}</View>
  </View>
);
