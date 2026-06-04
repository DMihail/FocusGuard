/** @format */

import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { BackIcon } from '@/assets/svg/ManageApps';
import { testIds } from '@/testing/testIds';

import { configureLimitsStyles as styles } from '../styles';
import type { ConfigureLimitsHeaderProps } from '../types';

export const ConfigureLimitsHeader = ({ appName, onBack }: ConfigureLimitsHeaderProps) => (
  <View style={styles.header} testID={testIds.configureLimits.header}>
    <Pressable
      testID={testIds.configureLimits.backButton}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      style={styles.backButton}
      onPress={onBack}
    >
      <BackIcon />
    </Pressable>

    <View style={styles.headerText}>
      <Text style={styles.title}>Configure Limits</Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {appName}
      </Text>
    </View>
  </View>
);
