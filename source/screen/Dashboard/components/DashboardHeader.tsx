/** @format */

import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { SettingsIcon } from '@/assets/svg/Dashboard';
import { useTheme } from '@/hooks/useTheme';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { testIds } from '@/testing/testIds';

import { createDashboardStyles } from '../styles';

type DashboardHeaderProps = {
  greeting: string;
  onSettingsPress?: () => void;
};

export const DashboardHeader = memo(({ greeting, onSettingsPress }: DashboardHeaderProps) => {
  const styles = useThemedStyles(createDashboardStyles);
  const { colors } = useTheme();

  return (
    <View style={styles.header} testID={testIds.dashboard.header}>
      <View style={styles.headerText}>
        <Text style={styles.greeting} testID={testIds.dashboard.greeting} accessibilityRole="header">
          {greeting}
        </Text>
        <Text style={styles.subtitle} accessibilityRole="text">
          Let's review your focus today
        </Text>
      </View>

      <Pressable
        testID={testIds.dashboard.settingsButton}
        accessibilityRole="button"
        accessibilityLabel="Open settings"
        style={styles.settingsButton}
        onPress={onSettingsPress}
      >
        <SettingsIcon stroke={colors.textPrimary} />
      </Pressable>
    </View>
  );
});
