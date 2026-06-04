/** @format */

import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { Link } from '@react-navigation/native';

import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';
import { configureSectionLayoutAnimation } from '@/utils/layoutAnimation';

import { dashboardStyles } from '../styles';

type QuickActionsSectionProps = {
  isMonitoring: boolean;
  canStartFocusMode: boolean;
  monitoringSubtitle: string;
  onToggleMonitoring: () => void;
};

export const QuickActionsSection = ({
  isMonitoring,
  canStartFocusMode,
  monitoringSubtitle,
  onToggleMonitoring,
}: QuickActionsSectionProps) => {
  const handleToggle = () => {
    if (!canStartFocusMode && !isMonitoring) {
      return;
    }

    configureSectionLayoutAnimation();
    onToggleMonitoring();
  };

  return (
    <View style={dashboardStyles.quickActions} testID={testIds.dashboard.quickActions}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isMonitoring ? 'Stop focus monitoring' : 'Start focus monitoring'}
        accessibilityState={{ disabled: !canStartFocusMode && !isMonitoring }}
        style={[
          dashboardStyles.quickActionCard,
          isMonitoring && dashboardStyles.quickActionCardActive,
          !canStartFocusMode && !isMonitoring && dashboardStyles.quickActionCardDisabled,
        ]}
        onPress={handleToggle}
        disabled={!canStartFocusMode && !isMonitoring}
        testID={testIds.dashboard.focusModeButton}
      >
        <View style={dashboardStyles.quickActionIconBadge}>
          <Text style={dashboardStyles.quickActionIcon}>🛡</Text>
        </View>
        <Text style={dashboardStyles.quickActionTitle}>{isMonitoring ? 'Stop Focus Mode' : 'Focus Mode'}</Text>
        <Text style={dashboardStyles.quickActionSubtitle}>{monitoringSubtitle}</Text>
      </Pressable>

      <Link
        screen="ManageApps"
        testID={testIds.dashboard.manageAppsButton}
        accessibilityRole="button"
        accessibilityLabel="Manage apps"
        style={dashboardStyles.quickActionCard}
      >
        <View style={[dashboardStyles.quickActionIconBadge, dashboardStyles.quickActionIconMuted]}>
          <Text style={dashboardStyles.quickActionIcon}>📊</Text>
        </View>
        <Text style={[dashboardStyles.quickActionTitle, { color: colors.textPrimary }]}>Manage Apps</Text>
        <Text style={[dashboardStyles.quickActionSubtitle, { color: colors.textSecondary }]}>Set limits</Text>
      </Link>
    </View>
  );
};
