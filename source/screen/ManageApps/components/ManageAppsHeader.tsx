/** @format */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { BackIcon } from '../../../assets/svg/ManageApps';
import { testIds } from '../../../testing/testIds';
import { manageAppsStyles } from '../styles';

type ManageAppsHeaderProps = {
  selectedCount: number;
  onBack: () => void;
};

export const ManageAppsHeader = ({ selectedCount, onBack }: ManageAppsHeaderProps) => (
  <View style={manageAppsStyles.header} testID={testIds.manageApps.header}>
    <Pressable
      testID={testIds.manageApps.backButton}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      style={manageAppsStyles.backButton}
      onPress={onBack}
    >
      <BackIcon />
    </Pressable>

    <View style={manageAppsStyles.headerText}>
      <Text style={manageAppsStyles.title}>Select Apps</Text>
      <Text style={manageAppsStyles.subtitle} testID={testIds.manageApps.selectedCount}>
        {selectedCount} selected
      </Text>
    </View>
  </View>
);
