/** @format */

import React, { memo } from 'react';
import { Switch, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/i18n';

import { useConfigureLimitsStyles } from '../styles';

export type StrictModeCardProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  testID?: string;
  toggleTestID?: string;
};

export const StrictModeCard = memo(({ value, onValueChange, testID, toggleTestID }: StrictModeCardProps) => {
  const styles = useConfigureLimitsStyles();
  const { presets } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.strictCard} testID={testID}>
      <View style={styles.strictText}>
        <Text style={styles.strictTitle}>{t('configureLimits.strictModeTitle')}</Text>
        <Text style={styles.strictDescription}>{t('configureLimits.strictModeDescription')}</Text>
      </View>
      <Switch
        testID={toggleTestID}
        accessibilityRole="switch"
        accessibilityLabel={t('configureLimits.strictModeA11y')}
        value={value}
        onValueChange={onValueChange}
        trackColor={presets.switchTrackColors}
        thumbColor={presets.switchThumbColor}
      />
    </View>
  );
});
