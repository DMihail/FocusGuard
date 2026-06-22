/** @format */

import React, { type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { useSettingsStyles } from '../styles';

type SettingsSectionProps = {
  title: string;
  testID?: string;
  children: ReactNode;
};

export const SettingsSection = ({ title, testID, children }: SettingsSectionProps) => {
  const styles = useSettingsStyles();

  return (
    <View style={styles.section} testID={testID}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
};
