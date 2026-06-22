/** @format */

import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { ChevronRightIcon } from '@/assets/svg/Settings';
import { useTheme } from '@/hooks/useTheme';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { testIds } from '@/testing/testIds';

import { createSettingsStyles } from '../styles';
import type { SettingsLinkItem } from '../types';

type SettingsLinkRowProps = SettingsLinkItem & {
  onPress: () => void;
};

export const SettingsLinkRow = ({
  id,
  title,
  description,
  Icon,
  iconBackgroundColor,
  onPress,
}: SettingsLinkRowProps) => {
  const styles = useThemedStyles(createSettingsStyles);
  const { colors } = useTheme();

  return (
    <Pressable
      testID={testIds.settings.linkRow(id)}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={styles.row}
      onPress={onPress}
    >
      <View style={styles.rowLeading}>
        <View style={[styles.iconBox, { backgroundColor: iconBackgroundColor }]}>
          <Icon stroke={colors.accent} />
        </View>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowDescription}>{description}</Text>
        </View>
      </View>

      <ChevronRightIcon stroke={colors.textMuted} />
    </Pressable>
  );
};
