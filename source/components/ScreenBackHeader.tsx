/** @format */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BackIcon } from '@/assets/svg/ManageApps';
import { createStylesHook } from '@/hooks/useThemedStyles';
import { borderRadius, fontSize, spacing, typography } from '@/theme';
import type { Theme } from '@/theme/types';

export type ScreenBackHeaderProps = {
  title: string;
  subtitle?: string;
  onBack: () => void;
  testID?: string;
  backButtonTestID?: string;
  subtitleTestID?: string;
};

const createScreenBackHeaderStyles = ({ colors, presets }: Theme) => {
  const { layoutPresets } = presets;

  return StyleSheet.create({
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
};

const useScreenBackHeaderStyles = createStylesHook(createScreenBackHeaderStyles);

export const ScreenBackHeader = ({
  title,
  subtitle,
  onBack,
  testID,
  backButtonTestID,
  subtitleTestID,
}: ScreenBackHeaderProps) => {
  const styles = useScreenBackHeaderStyles();

  return (
    <View style={styles.header} testID={testID}>
      <Pressable
        testID={backButtonTestID}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={styles.backButton}
        onPress={onBack}
      >
        <BackIcon />
      </Pressable>

      <View style={styles.headerText}>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} testID={subtitleTestID} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
};
