/** @format */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BackIcon } from '@/assets/svg/ManageApps';
import { borderRadius, colors, fontSize, layoutPresets, spacing, typography } from '@/theme';

export type ScreenBackHeaderProps = {
  title: string;
  subtitle?: string;
  onBack: () => void;
  testID?: string;
  backButtonTestID?: string;
  subtitleTestID?: string;
};

export const screenBackHeaderStyles = StyleSheet.create({
  header: {
    ...layoutPresets.rowCenter,
    gap: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.display,
    fontSize: fontSize.xxl,
    lineHeight: 32,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
});

export function ScreenBackHeader({
  title,
  subtitle,
  onBack,
  testID,
  backButtonTestID,
  subtitleTestID,
}: ScreenBackHeaderProps) {
  return (
    <View style={screenBackHeaderStyles.header} testID={testID}>
      <Pressable
        testID={backButtonTestID}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={screenBackHeaderStyles.backButton}
        onPress={onBack}
      >
        <BackIcon />
      </Pressable>

      <View style={screenBackHeaderStyles.headerText}>
        <Text accessibilityRole="header" style={screenBackHeaderStyles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={screenBackHeaderStyles.subtitle} testID={subtitleTestID} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
