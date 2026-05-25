/** @format */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronRightIcon } from '@/assets/svg/Settings';
import { testIds } from '@/testing/testIds';
import type { SettingsLinkItem } from '../types';
import { settingsStyles } from '../styles';

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
}: SettingsLinkRowProps) => (
  <Pressable
    testID={testIds.settings.linkRow(id)}
    accessibilityRole="button"
    accessibilityLabel={title}
    style={settingsStyles.row}
    onPress={onPress}
  >
    <View style={settingsStyles.rowLeading}>
      <View style={[settingsStyles.iconBox, { backgroundColor: iconBackgroundColor }]}>
        <Icon />
      </View>
      <View style={settingsStyles.rowText}>
        <Text style={settingsStyles.rowTitle}>{title}</Text>
        <Text style={settingsStyles.rowDescription}>{description}</Text>
      </View>
    </View>

    <ChevronRightIcon />
  </Pressable>
);
