/** @format */

import React, { memo } from 'react';
import { Switch, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { useConfigureLimitsStyles } from '../styles';

export type StrictModeCardProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  testID?: string;
  toggleTestID?: string;
};

export const StrictModeCard = memo(({ value, onValueChange, testID, toggleTestID }: StrictModeCardProps) => {
  const styles = useConfigureLimitsStyles();
  const { presets } = useTheme();

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
        trackColor={presets.switchTrackColors}
        thumbColor={presets.switchThumbColor}
      />
    </View>
  );
});
