/** @format */

import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Shield } from '@/assets/svg/Onboarding';
import { getAppDisplayName } from '@/constants/appDisplayName';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';

import { useErrorFallbackStyles } from './errorFallbackStyles';
import { ScreenSafeArea } from './ScreenSafeArea';

type ErrorFallbackProps = {
  error: Error | null;
  onRetry: () => void;
};

export const ErrorFallback = memo(({ error, onRetry }: ErrorFallbackProps) => {
  const styles = useErrorFallbackStyles();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const appDisplayName = getAppDisplayName();

  return (
    <ScreenSafeArea
      style={styles.screen}
      accessibilityLabel={t('errorBoundary.screenA11y')}
      testID={testIds.errorBoundary.screen}
    >
      <View style={styles.centered} accessible accessibilityRole="alert" accessibilityLiveRegion="assertive">
        <View style={styles.card} importantForAccessibility="no-hide-descendants">
          <Text style={styles.brand}>{appDisplayName}</Text>

          <View style={styles.iconBox} accessible={false}>
            <Shield width={44} height={54} stroke={colors.overLimit} />
          </View>

          <Text style={styles.title} accessibilityRole="header">
            {t('errorBoundary.title')}
          </Text>
          <Text style={styles.message}>{t('errorBoundary.message', { appName: appDisplayName })}</Text>

          {__DEV__ && error?.message ? (
            <View style={styles.devDetails} accessible={false}>
              <Text style={styles.devDetailsLabel}>{t('errorBoundary.devDetailsLabel')}</Text>
              <Text style={styles.devDetailsText} selectable>
                {error.message}
              </Text>
            </View>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('errorBoundary.retryA11y')}
              onPress={onRetry}
              style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
              testID={testIds.errorBoundary.retryButton}
            >
              <Text style={styles.retryButtonLabel}>{t('common.retry')}</Text>
            </Pressable>

            <Text style={styles.hint}>{t('errorBoundary.hint')}</Text>
          </View>
        </View>
      </View>
    </ScreenSafeArea>
  );
});

ErrorFallback.displayName = 'ErrorFallback';
