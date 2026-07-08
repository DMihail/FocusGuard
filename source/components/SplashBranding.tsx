/** @format */

import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Shield } from '@/assets/svg/Onboarding';
import { getAppDisplayName } from '@/constants/appDisplayName';
import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';
import { borderRadius, fontSize, lineHeight, spacing, typography } from '@/theme';
import type { Theme } from '@/theme/types';
import { useSystemTheme } from '@/theme/useSystemTheme';

import { LoadingDots } from '@/components/LoadingDots';

const createSplashBrandingStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    content: {
      alignItems: 'center',
      gap: spacing.lg,
      paddingHorizontal: spacing.xl,
    },
    iconBox: {
      width: 208,
      height: 208,
      borderRadius: borderRadius.xl,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xxl,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 4,
    },
    title: {
      ...typography.title,
      fontSize: 32,
      lineHeight: 40,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    subtitle: {
      ...typography.body,
      fontSize: fontSize.md,
      lineHeight: lineHeight.md,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    dots: {
      marginTop: spacing.md,
    },
  });

export const SplashBranding = memo(() => {
  const theme = useSystemTheme();
  const styles = useMemo(() => createSplashBrandingStyles(theme), [theme]);
  const { colors } = theme;
  const { t } = useTranslation();
  const appDisplayName = getAppDisplayName();

  return (
    <View
      style={styles.container}
      testID={testIds.app.loader}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={t('common.loading', { appName: appDisplayName })}
      accessibilityState={{ busy: true }}
    >
      <View style={styles.content} importantForAccessibility="no-hide-descendants">
        <View style={styles.iconBox} accessible={false}>
          <Shield width={82} height={101} stroke={colors.onPrimary} />
        </View>

        <Text style={styles.title} accessibilityRole="header">
          {appDisplayName}
        </Text>
        <Text style={styles.subtitle}>{t('branding.tagline')}</Text>

        <View style={styles.dots}>
          <LoadingDots />
        </View>
      </View>
    </View>
  );
});
