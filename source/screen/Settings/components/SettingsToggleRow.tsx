/** @format */

import React from 'react';
import { Switch, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { testIds } from '@/testing/testIds';

import { createSettingsStyles } from '../styles';
import type { SettingsToggleItem } from '../types';

type SettingsToggleRowProps = SettingsToggleItem & {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export const SettingsToggleRow = ({
  title,
  description,
  Icon,
  iconBackgroundColor,
  value,
  onValueChange,
  rowTestID = testIds.settings.notificationsRow,
  toggleTestID = testIds.settings.notificationsToggle,
}: SettingsToggleRowProps) => {
  const styles = useThemedStyles(createSettingsStyles);
  const { colors, presets } = useTheme();

  return (
    <View style={styles.row} testID={rowTestID}>
      <View style={styles.rowLeading}>
        <View style={[styles.iconBox, { backgroundColor: iconBackgroundColor }]}>
          <Icon stroke={colors.accent} />
        </View>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowDescription}>{description}</Text>
        </View>
      </View>

      <Switch
        testID={toggleTestID}
        accessibilityRole="switch"
        accessibilityLabel={title}
        value={value}
        onValueChange={onValueChange}
        trackColor={presets.switchTrackColors}
        thumbColor={colors.textPrimary}
      />
    </View>
  );
};
