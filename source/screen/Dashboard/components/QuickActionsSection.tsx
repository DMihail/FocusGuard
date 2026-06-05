/** @format */

import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { FocusModeSvg } from '@/assets/svg/Dashboard';
import { ManageAppsSvg } from '@/assets/svg/Dashboard/ManageApps';
import { testIds } from '@/testing/testIds';
import { configureSectionLayoutAnimation } from '@/utils/layoutAnimation';

import { dashboardStyles } from '../styles';

type QuickActionsSectionProps = {
  isMonitoring: boolean;
  canStartFocusMode: boolean;
  monitoringSubtitle: string;
  onToggleMonitoring: () => void;
  onOpenManageApps: () => void;
};

function QuickActionsSectionView({
  isMonitoring,
  canStartFocusMode,
  monitoringSubtitle,
  onToggleMonitoring,
  onOpenManageApps,
}: QuickActionsSectionProps) {
  const isFocusModeDisabled = !canStartFocusMode && !isMonitoring;

  const handleToggle = () => {
    if (isFocusModeDisabled) {
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
        accessibilityState={{ disabled: isFocusModeDisabled }}
        style={[
          dashboardStyles.quickActionCard,
          isMonitoring && dashboardStyles.quickActionCardActive,
          isFocusModeDisabled && dashboardStyles.quickActionCardDisabled,
        ]}
        onPress={handleToggle}
        disabled={isFocusModeDisabled}
        testID={testIds.dashboard.focusModeButton}
      >
        <View style={dashboardStyles.quickActionIconBadge}>
          <FocusModeSvg />
        </View>
        <Text style={dashboardStyles.quickActionTitle}>{isMonitoring ? 'Stop Focus Mode' : 'Focus Mode'}</Text>
        <Text style={dashboardStyles.quickActionSubtitle}>{monitoringSubtitle}</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Manage apps"
        accessibilityHint="Opens app selection and limits"
        onPress={onOpenManageApps}
        style={dashboardStyles.quickActionCard}
        testID={testIds.dashboard.manageAppsButton}
      >
        <View style={[dashboardStyles.quickActionIconBadge, dashboardStyles.quickActionIconMuted]}>
          <ManageAppsSvg />
        </View>
        <Text style={dashboardStyles.quickActionTitleMuted}>Manage Apps</Text>
        <Text style={dashboardStyles.quickActionSubtitleMuted}>Set limits</Text>
      </Pressable>
    </View>
  );
}

export const QuickActionsSection = memo(QuickActionsSectionView, areQuickActionsSectionPropsEqual);

function areQuickActionsSectionPropsEqual(previous: QuickActionsSectionProps, next: QuickActionsSectionProps): boolean {
  return (
    previous.isMonitoring === next.isMonitoring &&
    previous.canStartFocusMode === next.canStartFocusMode &&
    previous.monitoringSubtitle === next.monitoringSubtitle &&
    previous.onToggleMonitoring === next.onToggleMonitoring &&
    previous.onOpenManageApps === next.onOpenManageApps
  );
}
