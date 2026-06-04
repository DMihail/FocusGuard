/** @format */

import React from 'react';
import { Switch, Text, View } from 'react-native';

import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';

import { settingsStyles } from '../styles';
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
}: SettingsToggleRowProps) => (
  <View style={settingsStyles.row} testID={testIds.settings.notificationsRow}>
    <View style={settingsStyles.rowLeading}>
      <View style={[settingsStyles.iconBox, { backgroundColor: iconBackgroundColor }]}>
        <Icon />
      </View>
      <View style={settingsStyles.rowText}>
        <Text style={settingsStyles.rowTitle}>{title}</Text>
        <Text style={settingsStyles.rowDescription}>{description}</Text>
      </View>
    </View>

    <Switch
      testID={testIds.settings.notificationsToggle}
      accessibilityRole="switch"
      accessibilityLabel={title}
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: colors.switchTrackOff, true: colors.accent }}
      thumbColor={colors.textPrimary}
    />
  </View>
);
