/** @format */

import React, { memo } from 'react';
import { Switch, Text, View } from 'react-native';

import { colors, switchTrackColors } from '@/theme';

import { configureLimitsStyles as styles } from '../styles';

export type StrictModeCardProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  testID?: string;
  toggleTestID?: string;
};

function StrictModeCardView({ value, onValueChange, testID, toggleTestID }: StrictModeCardProps) {
  return (
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
        trackColor={switchTrackColors}
        thumbColor={colors.textPrimary}
      />
    </View>
  );
}

export const StrictModeCard = memo(StrictModeCardView, areStrictModeCardPropsEqual);

function areStrictModeCardPropsEqual(previous: StrictModeCardProps, next: StrictModeCardProps): boolean {
  return (
    previous.value === next.value &&
    previous.onValueChange === next.onValueChange &&
    previous.testID === next.testID &&
    previous.toggleTestID === next.toggleTestID
  );
}
