/** @format */

import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { SettingsIcon } from '@/assets/svg/Dashboard';
import { testIds } from '@/testing/testIds';

import { dashboardStyles } from '../styles';

type DashboardHeaderProps = {
  greeting: string;
  onSettingsPress?: () => void;
};

export const DashboardHeader = memo(({ greeting, onSettingsPress }: DashboardHeaderProps) => {
  return (
    <View style={dashboardStyles.header} testID={testIds.dashboard.header}>
      <View style={dashboardStyles.headerText}>
        <Text style={dashboardStyles.greeting} testID={testIds.dashboard.greeting} accessibilityRole="header">
          {greeting}
        </Text>
        <Text style={dashboardStyles.subtitle} accessibilityRole="text">
          Let's review your focus today
        </Text>
      </View>

      <Pressable
        testID={testIds.dashboard.settingsButton}
        accessibilityRole="button"
        accessibilityLabel="Open settings"
        style={dashboardStyles.settingsButton}
        onPress={onSettingsPress}
      >
        <SettingsIcon />
      </Pressable>
    </View>
  );
});
