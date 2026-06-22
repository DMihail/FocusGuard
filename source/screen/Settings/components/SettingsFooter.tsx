/** @format */

import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { getAppDisplayName } from '@/constants/appDisplayName';
import { getAppVersion } from '@/constants/appVersion';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { testIds } from '@/testing/testIds';

import { createSettingsStyles } from '../styles';

type SettingsFooterProps = {
  onTermsPress?: () => void;
};

export const SettingsFooter = ({ onTermsPress }: SettingsFooterProps) => {
  const styles = useThemedStyles(createSettingsStyles);

  return (
    <View style={styles.footer} testID={testIds.settings.footer}>
      <Text style={styles.version} testID={testIds.settings.version}>
        {`${getAppDisplayName()} v${getAppVersion()}`}
      </Text>
      <Pressable
        testID={testIds.settings.termsButton}
        accessibilityRole="button"
        accessibilityLabel="Terms and Privacy"
        onPress={onTermsPress}
      >
        <Text style={styles.termsLink}>Terms & Privacy</Text>
      </Pressable>
    </View>
  );
};
