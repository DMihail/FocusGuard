/** @format */

import React from 'react';
import { Text, View } from 'react-native';

import { LockPrivacyIcon } from '@/assets/svg/Settings';
import { getAppDisplayName } from '@/constants/appDisplayName';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';

import { useSettingsStyles } from '../styles';

export const SettingsPrivacyBanner = () => {
  const styles = useSettingsStyles();
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.privacyBanner} testID={testIds.settings.privacyBanner}>
      <View style={styles.privacyIconBox}>
        <LockPrivacyIcon stroke={colors.accentOnContainer} />
      </View>
      <View style={styles.privacyTextBlock}>
        <Text style={styles.privacyTitle}>{t('settings.privacyBannerTitle')}</Text>
        <Text style={styles.privacyBody}>{t('content.settingsPrivacyBanner', { appName: getAppDisplayName() })}</Text>
      </View>
    </View>
  );
};
