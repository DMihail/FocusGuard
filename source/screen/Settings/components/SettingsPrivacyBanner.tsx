/** @format */

import React from 'react';
import { Text, View } from 'react-native';

import { LockPrivacyIcon } from '@/assets/svg/Settings';
import { getSettingsPrivacyBanner } from '@/content/privacy';
import { useTheme } from '@/hooks/useTheme';
import { testIds } from '@/testing/testIds';

import { useSettingsStyles } from '../styles';

export const SettingsPrivacyBanner = () => {
  const styles = useSettingsStyles();
  const { colors } = useTheme();

  return (
    <View style={styles.privacyBanner} testID={testIds.settings.privacyBanner}>
      <View style={styles.privacyIconBox}>
        <LockPrivacyIcon stroke={colors.accentOnContainer} />
      </View>
      <View style={styles.privacyTextBlock}>
        <Text style={styles.privacyTitle}>Your Privacy Matters</Text>
        <Text style={styles.privacyBody}>{getSettingsPrivacyBanner()}</Text>
      </View>
    </View>
  );
};
