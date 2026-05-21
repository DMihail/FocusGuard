/** @format */

import React from 'react';
import { TextInput, View } from 'react-native';
import { SearchIcon } from '../../../assets/svg/ManageApps';
import { colors } from '../../../theme';
import { testIds } from '../../../testing/testIds';
import { manageAppsStyles } from '../styles';

type AppSearchFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export const AppSearchField = ({ value, onChangeText }: AppSearchFieldProps) => (
  <View style={manageAppsStyles.searchField} testID={testIds.manageApps.searchField}>
    <SearchIcon />
    <TextInput
      testID={testIds.manageApps.searchInput}
      value={value}
      onChangeText={onChangeText}
      placeholder="Search apps..."
      placeholderTextColor={colors.textDisabled}
      style={manageAppsStyles.searchInput}
      autoCapitalize="none"
      autoCorrect={false}
      clearButtonMode="while-editing"
    />
  </View>
);
