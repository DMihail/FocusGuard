/** @format */

import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { getAppDisplayName } from '@/constants/appDisplayName';
import { getAppVersion } from '@/constants/appVersion';
import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';

import { useSettingsStyles } from '../styles';

type SettingsFooterProps = {
  onTermsPress?: () => void;
};

export const SettingsFooter = ({ onTermsPress }: SettingsFooterProps) => {
  const styles = useSettingsStyles();
  const { t } = useTranslation();

  return (
    <View style={styles.footer} testID={testIds.settings.footer}>
      <Text style={styles.version} testID={testIds.settings.version}>
        {t('common.version', { appName: getAppDisplayName(), version: getAppVersion() })}
      </Text>
      <Pressable
        testID={testIds.settings.termsButton}
        accessibilityRole="button"
        accessibilityLabel={t('settings.termsA11y')}
        onPress={onTermsPress}
      >
        <Text style={styles.termsLink}>{t('common.termsPrivacy')}</Text>
      </Pressable>
    </View>
  );
};
