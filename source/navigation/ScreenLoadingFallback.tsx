/** @format */

import React, { memo, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';
import { useSystemTheme } from '@/theme/useSystemTheme';

const createStyles = (backgroundColor: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor,
    },
  });

/** Full-screen placeholder shown while a lazy stack screen chunk is loading. */
export const ScreenLoadingFallback = memo(() => {
  const { colors } = useSystemTheme();
  const styles = useMemo(() => createStyles(colors.background), [colors.background]);
  const { t } = useTranslation();

  return (
    <View
      style={styles.container}
      testID={testIds.navigation.lazyScreenLoader}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={t('common.loadingScreen')}
      accessibilityState={{ busy: true }}
    >
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
});

ScreenLoadingFallback.displayName = 'ScreenLoadingFallback';
