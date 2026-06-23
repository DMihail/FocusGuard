/** @format */

import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { SettingsIcon } from '@/assets/svg/Dashboard';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';

import { useDashboardStyles } from '../styles';

type DashboardHeaderProps = {
  greeting: string;
  onSettingsPress?: () => void;
};

export const DashboardHeader = memo(({ greeting, onSettingsPress }: DashboardHeaderProps) => {
  const styles = useDashboardStyles();
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.header} testID={testIds.dashboard.header}>
      <View style={styles.headerText}>
        <Text style={styles.greeting} testID={testIds.dashboard.greeting} accessibilityRole="header">
          {greeting}
        </Text>
        <Text style={styles.subtitle} accessibilityRole="text">
          {t('dashboard.headerSubtitle')}
        </Text>
      </View>

      <Pressable
        testID={testIds.dashboard.settingsButton}
        accessibilityRole="button"
        accessibilityLabel={t('common.openSettings')}
        style={styles.settingsButton}
        onPress={onSettingsPress}
      >
        <SettingsIcon stroke={colors.textPrimary} />
      </Pressable>
    </View>
  );
});
