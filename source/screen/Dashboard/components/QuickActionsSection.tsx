/** @format */

import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { FocusModeSvg, ManageAppsSvg } from '@/assets/svg/Dashboard';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';
import { configureSectionLayoutAnimation } from '@/utils/layoutAnimation';

import { useDashboardStyles } from '../styles';

type QuickActionsSectionProps = {
  isMonitoring: boolean;
  canStartFocusMode: boolean;
  monitoringSubtitle: string;
  onToggleMonitoring: () => void;
  onOpenManageApps: () => void;
};

const areQuickActionsSectionPropsEqual = (
  previous: QuickActionsSectionProps,
  next: QuickActionsSectionProps,
): boolean =>
  previous.isMonitoring === next.isMonitoring &&
  previous.canStartFocusMode === next.canStartFocusMode &&
  previous.monitoringSubtitle === next.monitoringSubtitle &&
  previous.onToggleMonitoring === next.onToggleMonitoring &&
  previous.onOpenManageApps === next.onOpenManageApps;

export const QuickActionsSection = memo(
  ({
    isMonitoring,
    canStartFocusMode,
    monitoringSubtitle,
    onToggleMonitoring,
    onOpenManageApps,
  }: QuickActionsSectionProps) => {
    const styles = useDashboardStyles();
    const { colors } = useTheme();
    const { t } = useTranslation();
    const isFocusModeDisabled = !canStartFocusMode && !isMonitoring;

    const handleToggle = () => {
      if (isFocusModeDisabled) {
        return;
      }

      configureSectionLayoutAnimation();
      onToggleMonitoring();
    };

    return (
      <View style={styles.quickActions} testID={testIds.dashboard.quickActions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isMonitoring ? t('dashboard.focusModeStopA11y') : t('dashboard.focusModeStartA11y')}
          accessibilityState={{ disabled: isFocusModeDisabled }}
          style={[
            styles.quickActionCard,
            isMonitoring && styles.quickActionCardActive,
            isFocusModeDisabled && styles.quickActionCardDisabled,
          ]}
          onPress={handleToggle}
          disabled={isFocusModeDisabled}
          testID={testIds.dashboard.focusModeButton}
        >
          <View style={styles.quickActionIconBadge}>
            <FocusModeSvg stroke={colors.accentOnContainer} />
          </View>
          <Text style={styles.quickActionTitle} numberOfLines={2}>
            {isMonitoring ? t('dashboard.stopFocusMode') : t('dashboard.focusMode')}
          </Text>
          <Text style={styles.quickActionSubtitle}>{monitoringSubtitle}</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('dashboard.manageAppsA11y')}
          onPress={onOpenManageApps}
          style={styles.quickActionCard}
          testID={testIds.dashboard.manageAppsButton}
        >
          <View style={[styles.quickActionIconBadge, styles.quickActionIconMuted]}>
            <ManageAppsSvg stroke={colors.accentOnContainer} />
          </View>
          <Text style={styles.quickActionTitleMuted} numberOfLines={2}>
            {t('dashboard.manageApps')}
          </Text>
          <Text style={styles.quickActionSubtitleMuted}>{t('dashboard.manageAppsSubtitle')}</Text>
        </Pressable>
      </View>
    );
  },
  areQuickActionsSectionPropsEqual,
);
