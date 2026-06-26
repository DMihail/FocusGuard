/** @format */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/i18n';

type ErrorFallbackProps = {
  onRetry: () => void;
};

export const ErrorFallback = ({ onRetry }: ErrorFallbackProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{t('errorBoundary.title')}</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{t('errorBoundary.message')}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('errorBoundary.retryA11y')}
        onPress={onRetry}
        style={[styles.button, { backgroundColor: colors.accent }]}
      >
        <Text style={[styles.buttonLabel, { color: colors.accentOnContainer }]}>{t('common.retry')}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
