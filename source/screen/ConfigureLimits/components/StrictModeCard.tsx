/** @format */

import React from 'react';
import { Switch, Text, View } from 'react-native';

import { colors } from '@/theme';

import { configureLimitsStyles as styles } from '../styles';

export type StrictModeCardProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  testID?: string;
  toggleTestID?: string;
};

export const StrictModeCard = ({ value, onValueChange, testID, toggleTestID }: StrictModeCardProps) => (
  <View style={styles.strictCard} testID={testID}>
    <View style={styles.strictText}>
      <Text style={styles.strictTitle}>Strict Mode</Text>
      <Text style={styles.strictDescription}>Disable the 5-minute snooze when blocked</Text>
    </View>
    <Switch
      testID={toggleTestID}
      accessibilityRole="switch"
      accessibilityLabel="Strict mode"
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: colors.switchTrackOff, true: colors.accent }}
      thumbColor={colors.textPrimary}
    />
  </View>
);
